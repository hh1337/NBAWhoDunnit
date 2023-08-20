import NBAHttps from './NBAHttps.js'
import playerHeadshots from './static/playerHeadshotv3.json' assert { type: 'json'}

const nba = new NBAHttps()
const playerHeadshotsMap = new Map(Object.entries(playerHeadshots))
const STARTING_HEALTH = 50
const TIMER_MAX = 5000
const WAIT_UPDATE_TIME = 1500
const TIMER_WARNING = 11
const EXTRA_LIFE_PROB = 1
const DEFAULT_HEADSHOT_PIC = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png'
const player1Btn = document.getElementById('player1')
const player2Btn = document.getElementById('player2')
const player1ImgBtn = document.getElementById('player1img')
const player2ImgBtn = document.getElementById('player2img')
const timerObj = document.getElementById('timer')
let correctPlayer, correctBtnId, wrongBtnId
let currLives, streak, score, time, colorVal, addOrSub, colorFcn
let player1, player2
let seconds, timerIsRed

function getNBAData() {  
  return new Promise((resolve) => {
    nba.getLastSeason().then((currentYear) => {
      const randomYear = (sessionStorage.selectedYear == "0") ? Math.floor(Math.random() * 3 + (currentYear - 3)) : sessionStorage.selectedYear
      const randomTeamId = (sessionStorage.selectedTeam == "0") ? Math.floor(Math.random() * (31-1) + 1): sessionStorage.selectedTeam
      nba.getRandomGame(randomYear, randomTeamId).then((game) => {
        nba.getGameStats(game.id).then((stats) => {             
          nba.chooseTwoPlayers(nba.separateTeams(stats)).then((players) => {        
            resolve(players)
          })
        })
      })
    })    
  }
  )
}

function updateTable() {
  nba.statsMap.forEach((val, key) => {
    document.getElementById(`${key}Name`).innerHTML = val
    document.getElementById(key).innerHTML = correctPlayer[key] ?? 0
  })
}

function updatePlayerBtns() {
  const btnColor = 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-2 text-white px-5 py-1 rounded-full'
  player1Btn.className = btnColor
  player2Btn.className = btnColor

  let player1Info = player1['player']
  let player2Info = player2['player']
  let team1 = player1['team']['abbreviation']
  let team2 = player2['team']['abbreviation']

  player1Btn.innerHTML = `${player1Info['first_name']} ${player1Info['last_name']} (${team1})`
  player2Btn.innerHTML = `${player2Info['first_name']} ${player2Info['last_name']} (${team2})`
  
  if (Math.random() < 0.5) {
    correctBtnId = 'player1'
    correctPlayer = player1
    wrongBtnId = 'player2'
  } else {
    correctBtnId = 'player2'
    correctPlayer = player2
    wrongBtnId = 'player1'
  }
}

function updateTitle() {
  const game = player1['game']
  const homeID = game['home_team_id']
  const homeScore = game['home_team_score']
  const visitorScore = game['visitor_team_score']
  let homeName, visitorName, homeLocation
  let date = game['date'].split('T')[0]    

  if (player1['team']['id'] == homeID) {
    homeName = player1['team']['full_name']
    visitorName = player2['team']['full_name']
    homeLocation = player1['team']['city']
  } else {
    homeName = player2['team']['full_name']
    visitorName = player1['team']['full_name']
    homeLocation = player2['team']['city']
  }
  
  document.getElementById('gameSummary').innerHTML = `@${homeLocation}`
  document.getElementById('gameDate').innerHTML = date
  document.getElementById('team1pts').innerHTML = `${homeScore} pts`
  document.getElementById('team2pts').innerHTML = `${visitorScore} pts`  
}

function resetTimer() {
  seconds = TIMER_MAX  
  colorVal = 260
  addOrSub = -1
  timerObj.style.color = 'white'
  timerIsRed = false

  time = setInterval(function() {        
    timerObj.innerHTML = seconds + "s"    
    if (seconds < TIMER_WARNING) {      
      if (!timerIsRed) {
        timerIsRed = true
        turnOnColor()
      }      
    }

    if (seconds < 0) {
      clearInterval(time)
      clearInterval(colorFcn)
      endGame()
    }
    seconds -= 1  
  }, 1000) 
}

function turnOnColor() {
  colorFcn = setInterval(function() {       
    if (colorVal < 150) {
      addOrSub = 1
    }
    if (colorVal > 255) {
      addOrSub = -1
    }
    colorVal += (5 * addOrSub)    
    timerObj.style.color = `rgb(${colorVal},0,0)`
    if (seconds < 0) {
      clearInterval(colorFcn)
    }
  }, 50)  
}

function updatePlayerImg() {
  let player1Id = player1['player']['id']
  let player2Id = player2['player']['id']

  document.getElementById('player1img').src = getPlayerHeadshot(player1Id)
  document.getElementById('player2img').src = getPlayerHeadshot(player2Id)
}

function getPlayerHeadshot(playerId) {
  return playerHeadshotsMap.get(playerId.toString()) || DEFAULT_HEADSHOT_PIC
}

function getTeamImg(teamId) {
  return `static/nbaLogos/${teamId}.png`
}

function updateTeamImg() {  
  let team1ID = player1['team']['id']
  let team2ID = player2['team']['id']

  document.getElementById('team1img').src = getTeamImg(team1ID)
  document.getElementById('team2img').src = getTeamImg(team2ID)
}

function updatePage() {
  hideAnswerStatus()
  updatePlayerBtns()    
  updatePlayerImg()
  updateTeamImg()
  updateTitle()
  updateTable()
  displayLives()
  displayScore()
  changeBtnStatus(false)  
}

function updatePlayers() {
  return new Promise((resolve) =>  {
      getNBAData().then((players) => { 
        player1 = players[0]
        player2 = players[1]
        resolve()
      })
    })
}

function displayStreakMsg() {
  console.log(`You are on a ${streak} win streak!!!`)
}

function displayLives() {
  document.getElementById('currLives').innerHTML = currLives
}

function displayScore() {
  document.getElementById('score').innerHTML = score
}

function changeBtnStatus(disableBool) {
  let onclickFcn = (disableBool) ? undefined: checkAnswer
  
  player1Btn.disabled = disableBool
  player2Btn.disabled = disableBool  
  
  player1ImgBtn.onclick = onclickFcn
  player2ImgBtn.onclick = onclickFcn
}

function changeBtnColors() {
  document.getElementById(correctBtnId).className = 'bg-gradient-to-r from-green-800 via-green-600 to-green-400 border-2 text-white text-white px-5 py-1 rounded-full'
  document.getElementById(wrongBtnId).className = 'bg-gradient-to-r from-red-800 via-red-600 to-red-400 border-2 text-white px-5 py-1 rounded-full'  
}

function displayAnswerStatus(correctBool) {
  if (correctBool) {
    document.getElementById('statusImage') .src = "static/greenCheck.png"
  } else {
    document.getElementById('statusImage') .src = "static/redX.png"
  }

  document.getElementById('statusDiv').style.display = 'block'
}

function hideAnswerStatus() {
  document.getElementById('statusDiv').style.display = 'none'
}

const checkAnswer = (btn) => {   
  changeBtnStatus(true) // disable buttons so they can't be continually pressed
  changeBtnColors() // highlight correct and wrong answer buttons
  clearInterval(time)
  clearInterval(colorFcn)
  
  if (btn.target.id.startsWith(correctBtnId)) {
      console.log('YOU ARE CORRECT!')
      displayAnswerStatus(true)
      
      // update streak and score
      score += 1
      streak += 1                
      if (streak % 2 === 0) {
        displayStreakMsg()
      }

      if (Math.random() < EXTRA_LIFE_PROB) {
        addLife()
      }            
    } else {
      console.log(`YOU ARE WRONG. It should be ${correctPlayer['player']['first_name']} ${correctPlayer['player']['last_name']} :(`)
      displayAnswerStatus(false)

      // decrement health and reset streak
      currLives -= 1
      streak = 0

      // if no more life
      if (currLives < 0) {
        endGame()
      }   
  }

  let promise = updatePlayers()
  setTimeout(() => {
    promise.then(() => {      
      updatePage()
    })
  }, WAIT_UPDATE_TIME)    
  resetTimer()
}

function addLife() {
  const lifeAdded = document.getElementById('lifeAdded')
  currLives += 1
  lifeAdded.style.display = 'block'
  setTimeout(() => {
    lifeAdded.style.display = 'none'
  }, 1000)
}

function initializePage() {
  currLives = STARTING_HEALTH
  score = 0
  streak = 0
  seconds = TIMER_MAX  
  
  let promise = updatePlayers()
  setTimeout(() => {
    promise.then(() => {
      updatePage()
    }, WAIT_UPDATE_TIME)
  })
  resetTimer()
}

function endGame() {
    sessionStorage.playerScore = score
    window.location.href = 'gameOver.html'
}

window.onload = function () {    
  initializePage()
  player1Btn.addEventListener('click', checkAnswer)
  player2Btn.addEventListener('click', checkAnswer)  
  player1ImgBtn.onclick = checkAnswer
  player2ImgBtn.onclick = checkAnswer
  document.getElementById('mainMenu').onclick = function () {
    window.location.href = 'menu.html'
  }
}
