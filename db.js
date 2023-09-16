import mysql from 'mysql2'

export default class SQLObject {       
    
    constructor() {
      this.pool = mysql.createPool({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASS || '0512',
        database: process.env.DB_NAME || 'nbaGame'
    }    
    ).promise()
    }

    async getNotes() {
        const [rows] = await this.pool.query("SELECT * FROM players")
        return rows
    }

    async getTop(n) {
        const [rows] = await this.pool.query(`
            SELECT * 
            FROM players 
            ORDER BY score DESC 
            LIMIT ${n} 
        `, [n])
        return rows
    }

    async playerExists(playerName) {
        const [rows] = await this.pool.query(`SELECT EXISTS(SELECT 1 FROM players WHERE name = ?);`, [playerName])
        return rows
    }

    async createEntry(name, score) {
        const [result] = await this.pool.query(`
        INSERT INTO players (name, score)
        VALUES (?, ?)
        `, [name, score])
        return {
            id: result.id,
            name,
            score
        }
    }
}
