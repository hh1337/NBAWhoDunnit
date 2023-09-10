import mysql from 'mysql2'

export default class SQLObject {       
    
    constructor() {
      this.pool = mysql.createPool({
        host: '127.0.0.1',
        user: 'root',
        password: '0512',
        database: 'notes_app'
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
