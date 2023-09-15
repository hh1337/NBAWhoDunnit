import express from 'express'
import cors from 'cors'
import SQLObject from './database.js'
import NBAHttps from './NBAHttps.js'
import playerHeadshots from './static/playerHeadshotv3.json' assert { type: 'json'}

const app = express()
const sqlObj = new SQLObject()
const nba = new NBAHttps()
const playerHeadshotsMap = new Map(Object.entries(playerHeadshots))

app.use(cors())
app.use(express.json())

app.get("/get", async (req, res) => {
    const randomYear = req.query['randomYear']
    const randomTeamId = req.query['randomTeamId']
    nba.getRandomGame(randomYear, randomTeamId).then((game) => {
        nba.getGameStats(game.id).then((stats) => {             
        nba.chooseTwoPlayers(nba.separateTeams(stats)).then((players) => {        
            res.send(players)
        })
        })
    })     
})

app.get("/getLastSeason", async (req, res) => {
    nba.getLastSeason().then((currentYear) => {        
        res.send(currentYear.toString())
    })  
})

app.get("/", async (req, res) => {
    res.send('fdsa')
})

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
        sqlObj.getTop(8).then(data => {
            res.send(data)
        })      
    }
    catch (err) {
        console.log(err)
    }
})

app.post('/addEntry', (req, res) => {      
    sqlObj.createEntry(req.body.name, req.body.score).then((data) => {
        res.send(data)
    })
})

app.get('/playerExists', (req, res) => {
    sqlObj.playerExists(req.query.name).then((data) => {
        res.send(data)
    })
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})