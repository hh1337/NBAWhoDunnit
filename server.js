import express from 'express'
import cors from 'cors'
import SQLObject from './db.js'
import NBAHttps from './NBAHttps.js'
import path from 'path'
import { fileURLToPath } from 'url';

const app = express()
const sqlObj = new SQLObject()
const nba = new NBAHttps()

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

app.get("/getPlayerHeadshot", async (req, res) => {
    res.send(nba.getPlayerHeadshot(req.query['playerId']))
})

app.get("/getLastSeason", async (req, res) => {
    nba.getLastSeason().then((currentYear) => {        
        res.send(currentYear.toString())
    })  
})

app.get("/", async (req, res) => {
    res.sendFile(path.join(__dirname + '/public/menu.html'))
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
        sqlObj.getTop(req.query['n']).then(data => {
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


const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, './public')))

// Return any unknown url to menu
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/menu.html'))
})

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`listening on port ${port}`)
})
