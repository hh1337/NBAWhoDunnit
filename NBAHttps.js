import statsMap from './nbaStatsMap.json' assert { type: 'json'}
import MaxPriorityQueue from "./pq/MaxPriorityQueue.js";

export default class NBAHttps {
  URL = 'https://www.balldontlie.io/api/v1/'    
  statsMap = new Map(Object.entries(statsMap)) 
  
  constructor() {
    this.currStat
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
        this.sendApiRequest(newEndpoint).then(responseData => {
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

  chooseTwoPlayers(teams) {    
    const team1 = teams[0]
    const team2 = teams[1]
    let player1, player2, player1Val, player2Val
    
    return new Promise((resolve, reject) => {
        while (player1Val === player2Val) {
          this.setCurrStat()

          const queue1 = new MaxPriorityQueue((stat) => stat[this.currStat])
          const queue2 = new MaxPriorityQueue((stat) => stat[this.currStat])
          
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