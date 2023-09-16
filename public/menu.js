const menuPicMap = new Map(Object.entries({
    "0": 3000,
    "1": 2800,
    "2": 2800,
    "3": 1500,
    "4": 1500
  }))


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
                document.getElementById('menuPic').src = `static/menuGifs/${menuIdx}.gif`
            }
            }, 1000)            
        document.getElementById('menuPic').src = `static/menuGifs/${menuIdx}.gif`
    }
}
  
loopMenuGif()

axios.get("/getLastSeason").then((year) => { 
    const yearObj = document.getElementById('year')
    for (let i=year.data;i>1989;i--) {
        let option = new Option(i, i)
        yearObj.add(option, undefined)
    }      
})  
document.getElementById('start').onclick = startGame
document.getElementById('leaderboard').onclick = leaderBoard

  