import statsMap from './nbaStatsMap.json' assert { type: 'json'}
import playerHeadshots from './public/static/playerHeadshotv3.json' assert { type: 'json'}
import MaxPriorityQueue from '@datastructures-js/priority-queue'
import XMLHttpRequest from 'xhr2';

export default class NBAHttps {
  URL = 'https://www.balldontlie.io/api/v1/'    
  statsMap = new Map(Object.entries(statsMap)) 
  playerHeadshotsMap = new Map(Object.entries(playerHeadshots))
  DEFAULT_HEADSHOT_PIC = 'https://a.espncdn.com/combiner/i?img=/i/headshots/nophoto.png'
  
  constructor() {
    this.currStat
  }

  getLastSeason() {
    const currentYear = new Date().getFullYear() 

    // See if any games have been played in the months of Oct to Nov (indicates season started)
    const endpoint = `games?per_page=100&start_date=${currentYear}-10-01&end_date=${currentYear}-11-01`      

    return new Promise((resolve) => {
      this.sendApiRequest(endpoint).then(responseData => {
        responseData['data'].forEach((item, i) => {
          if (item['period'] > 0) {        
            resolve(currentYear) 
          }
        })      
        resolve(currentYear - 1)
      })   
    })   
  }

  sendApiRequest(endpoint) {
    const promise = new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
      const url = this.URL + endpoint
          xhr.open('GET', url);

          xhr.responseType = 'json';

          xhr.onload = () => {
              resolve(xhr.response)
          };
          xhr.send();
      });
      return promise;
  }

  getRandomGame(season, teamID) {
    const endpoint = `games?seasons[]=${season}&team_ids[]=${teamID}`

    return new Promise((resolve, reject) => {
      this.sendApiRequest(endpoint).then(responseData => {
        const meta = responseData['meta']
        const perPage = meta['per_page']
        const total = meta['total_count']

        const randomIdx = Math.floor(Math.random() * total + 1)
        const goToPage = Math.ceil(randomIdx / perPage)
        const pageIdx = randomIdx - (perPage * (goToPage - 1)) - 1

        const newEndpoint = `${endpoint}&page=${goToPage}`   
        // console.log(newEndpoint)     
        this.sendApiRequest(newEndpoint).then(responseData => {
          // console.log(responseData['data'][pageIdx])
          resolve(responseData['data'][pageIdx])
        })

      })
    })
  }

  getGameStats(gameId) {
    const endpoint = `stats?game_ids[]=${gameId}&per_page=100`
    return new Promise((resolve, reject) => {
      this.sendApiRequest(endpoint).then((responseData) => {
        resolve(responseData['data'])
      })
    })
  }
  
  separateTeams(stats) {
    const team1ID = stats[0]['team']['id']
    let team1 = []
    let team2 = []
    stats.forEach((item, i) => {
      if (item['team']['id'] == team1ID) {
        team1.push(item)
      } else {
        team2.push(item)
      }
    })

    return [team1, team2]
  }

  setCurrStat() {
    this.currStat = this.chooseRandomStat()
  }

  chooseRandomStat() {    
    const stats = Array.from(this.statsMap.keys())    
    const randIdx = Math.floor(Math.random() * stats.length)            
    return stats[randIdx]
  }

  getPlayerHeadshot(playerId) {
    return this.playerHeadshotsMap.get(playerId.toString()) || this.DEFAULT_HEADSHOT_PIC
  }

  chooseTwoPlayers(teams) {    
    const team1 = teams[0]
    const team2 = teams[1]
    let player1, player2, player1Val, player2Val
    
    return new Promise((resolve, reject) => {
        while (player1Val === player2Val) {
          this.setCurrStat()

          const queue1 = new MaxPriorityQueue.MaxPriorityQueue((stat) => stat[this.currStat])
          const queue2 = new MaxPriorityQueue.MaxPriorityQueue((stat) => stat[this.currStat])
          
          team1.forEach((item) => {queue1.enqueue(item)})
          team2.forEach((item) => {queue2.enqueue(item)})
               
          for (let i=0;i<team1.length;i++) {
            player1 = queue1.dequeue()
            if ((player1[this.currStat] !== player1Val) && (player1[this.currStat] !== null)) {
              player1Val = player1[this.currStat]
              break
            }
          }
      
          for (let i=0;i<team2.length;i++) {
            player2 = queue2.dequeue()
            if (player2[this.currStat] !== player1Val) {
              player2Val = player2[this.currStat]
              break
            }
          } 
        }
        resolve([player1, player2])
      })
  }
}