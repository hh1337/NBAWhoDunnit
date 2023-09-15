let playerScore, highestStreak

function checkNameExists(playerName) {
    return new Promise((resolve, reject) => {
        axios.get("http://127.0.0.1:8080/playerExists", {
            params: {name: playerName}
        }).then((res) => {
            resolve(Object.values(res.data[0])[0])
        })
    }) 
}

function submitScore() {    
    const playerName = document.getElementById('name').value    
    checkNameExists(playerName).then((playerExists) => {
        if (playerExists) {
            console.log('i exist')
            return
        } 
        
        axios.post("http://127.0.0.1:8080/addEntry", {name: playerName, score: playerScore}).then((res) => {
            console.log(res)
        })

        window.location.href = 'leaderboard.html'
    })

    // console.log(playerName)
    // let user = {name: playerName, score: playerScore}
    // axios.get("http://127.0.0.1:8080/playerExists", {
    //     params: user
    // }).then((res) => {
    //     const boolean = Object.values(res.data[0])[0]    
    //     if (boolean) {
    //         console.log(true)
    //     } else {
    //         console.log(false)
    //     }        
    // })
    

}

window.onload = function () {            
    playerScore = sessionStorage.playerScore
    highestStreak = sessionStorage.highestStreak

    sessionStorage.playerScore = undefined
    sessionStorage.highestStreak = undefined

    playerScore = 1029
    
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
    
    if (playerScore === 'undefined') {
        document.getElementById('scoreSubmitter').style.display = 'None'
    }    
    
    // document.getElementById('submitScoreBtn').onclick = submit
}