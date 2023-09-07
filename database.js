import mysql from 'mysql2'

const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '0512',
    database: 'notes_app'
}    
).promise()

async function getNotes() {
    const [rows] = await pool.query("SELECT * FROM notes")
    return rows
}

async function getNote(id) {
    const [rows] = await pool.query(`
        SELECT * 
        FROM notes
        WHERE id = ?
    `, [id])
    return rows[0]
}

const note = await getNote(3)
console.log(note)