import NBAHttps from './NBAHttps.js'  
import menuGifs from '/menuGifs.json' assert { type: 'json'}

const menuPicMap = new Map(Object.entries(menuGifs))


function startGame () {
    sessionStorage.selectedTeam = document.getElementById('teams').value
    sessionStorage.selectedYear = document.getElementById('year').value       
    window.location.href = 'index.html'             
}     

function leaderBoard () {      
    window.location.href = 'leaderboard.html'             
}     

function loopMenuGif() {
    let menuPicInterval
    var menuIdx = 0
    var runningTimer = 0

    for (let i=0;i<5;i++) {
        menuPicInterval = setInterval(() => {            
            runningTimer += 100            
            if (runningTimer >= menuPicMap.get(menuIdx.toString())) {
                clearInterval(menuPicInterval)
                menuIdx += 1
                runningTimer = 0
                if (menuIdx > menuPicMap.size - 1) {
                    menuIdx = 0
                }            
                console.log(menuIdx)
                document.getElementById('menuPic').src = `static/menuGifs/${menuIdx}.gif`
            }
            }, 1000)            
        document.getElementById('menuPic').src = `static/menuGifs/${menuIdx}.gif`
    }
}

window.onload = function () {    
    const nba = new NBAHttps()
    let option
    
    loopMenuGif()

    nba.getLastSeason().then(year => {                                            
        const yearObj = document.getElementById('year')
        for (let i=year;i>1989;i--) {
            option = new Option(i, i)
            yearObj.add(option, undefined)
        }            
    })
    
    document.getElementById('start').onclick = startGame
    document.getElementById('leaderboard').onclick = leaderBoard
}
  