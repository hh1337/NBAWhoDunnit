        
const table = document.getElementById('leaderboardTable')
const params = {n: 10}
axios.get('/getTop', {params:params}).then(function (response) {
  const players = response.data

  let iter = 1
  players.forEach(player => {        
      let row = table.insertRow(-1);

      let c1 = row.insertCell(0);
      let c2 = row.insertCell(1);
      let c3 = row.insertCell(2);
    
      c1.innerText = iter
      c2.innerText = player['name']
      c3.innerText = player['score']   
      if (iter == 1) {
          c3.innerHTML = `${player['score']} <img class="gold-medal" src="https://github.com/malunaridev/Challenges-iCodeThis/blob/master/4-leaderboard/assets/gold-medal.png?raw=true" alt="gold medal">`
      }
  
      c1.classList.add('number')
      c2.classList.add('name')
      c3.classList.add('points')    
      
      iter += 1
  })      

})

document.getElementById('mmBtn').onclick = function () {
    window.location.href = 'menu.html'
}
