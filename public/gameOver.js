let playerScore, highestStreak

function checkNameExists(playerName) {
    return new Promise((resolve, reject) => {
        axios.get("/playerExists", {
            params: {name: playerName}
        }).then((res) => {
            resolve(Object.values(res.data[0])[0])
        })
    }) 
}

function submitScore() {    
    const playerName = document.getElementById('name').value    
    if ((playerName) === '') {
        document.getElementById('playerExists').style.display = 'block'
        document.getElementById('playerExists').innerHTML = 'Please enter name!'        
        return
    }
    checkNameExists(playerName).then((playerExists) => {
        if (playerExists) {
            document.getElementById('playerExists').style.display = 'block'
            document.getElementById('playerExists').innerHTML = 'Player Already exists!'        
            document.getElementById('name').value  = ''
            return
        } 
        
        axios.post("/addEntry", {name: playerName, score: playerScore}).then((res) => {
            
        })

        window.location.href = 'leaderboard.html'
    })
}

          
playerScore = sessionStorage.playerScore
highestStreak = sessionStorage.highestStreak

// if (playerScore === 'undefined') {
//     window.location.href = 'menu.html'
// }

sessionStorage.playerScore = undefined
sessionStorage.highestStreak = undefined

document.getElementById('gameOverScore').innerHTML = playerScore
document.getElementById('highestStreak').innerHTML = highestStreak

document.getElementById('mmBtn').onclick = function () {
    window.location.href = 'menu.html'
}


document.getElementById('playAgainBtn').onclick = function () {
    window.location.href = 'index.html'
}

document.getElementById('submitScoreBtn').onclick = function () {
    submitScore()
}

// if (playerScore === 'undefined') {
//     document.getElementById('scoreSubmitter').style.display = 'None'
// }            
