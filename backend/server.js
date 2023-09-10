import express from 'express'
import cors from 'cors'
import mysql2 from 'mysql2'
import SQLObject from './database.js'

const app = express()
const sqlObj = new SQLObject()

app.use(cors())

app.get("/getAll", async (req, res) => {
    try {        
        sqlObj.getNotes().then(data => {
            res.send(data)
        })      
    }
    catch (err) {
        console.log(err)
    }
})

app.get('/getTop', (req, res) => {
    try {        
        sqlObj.getTop(5).then(data => {
            res.send(data)
        })      
    }
    catch (err) {
        console.log(err)
    }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})