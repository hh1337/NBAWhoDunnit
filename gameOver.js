window.onload = function () {            
    const playerScore = sessionStorage.playerScore
    sessionStorage.playerScore = undefined
    
    document.getElementById('gameOverScore').innerHTML = playerScore

    document.getElementById('mmBtn').onclick = function () {
        window.location.href = 'menu.html'
    }

    document.getElementById('playAgainBtn').onclick = function () {
        window.location.href = 'index.html'
    }
}