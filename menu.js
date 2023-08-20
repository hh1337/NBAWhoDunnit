import NBAHttps from './NBAHttps.js'  

function startGame () {
    sessionStorage.selectedTeam = document.getElementById('teams').value
    sessionStorage.selectedYear = document.getElementById('year').value
    console.log(sessionStorage.selectedTeam)  
    console.log(sessionStorage.selectedYear)            
    window.location.href = 'index.html'             
}     

window.onload = function () {    
    const nba = new NBAHttps()
    let option
    
    nba.getLastSeason().then(year => {                                            
        const yearObj = document.getElementById('year')
        for (let i=year;i>1989;i--) {
            option = new Option(i, i)
            yearObj.add(option, undefined)
        }            
    })
    
    document.getElementById('start').onclick = startGame
}
  