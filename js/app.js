function setupGame() {

  const width = 21
  const gridSize = width ** 2
  const grid = document.querySelector('.grid')
  const cells = []
  let player = 430
  let playerLaser = []
  let playerLaserTimer
  let aliens = [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103]
  let alienArray = aliens.slice()
  let explosion = null



  //creates grid ========================================
  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement('div')
    grid.appendChild(cell)
    cells.push(cell)
  }



  // Adds player ========================================
  cells[player].classList.add('player')




  // Adds aliens to grid =====================================
  alienArray.forEach(element => {
    cells[element].classList.add('aliens')
  })




  // Adds event listeners for user key input ===================================
  document.addEventListener('keyup', (e) => {
    switch (e.keyCode) {
      case 37: {
        if (player === 420) {
          return
        }
        cells[player].classList.remove('player')
        player = player - 1
        cells[player].classList.add('player')
        break
      }
      case 39: {
        if (player === ((gridSize) - 1)) {
          return
        }
        cells[player].classList.remove('player')
        player = player + 1
        cells[player].classList.add('player')
        break
      }
      case 32: {
        playerLaser = [player - 21]
        cells[playerLaser].classList.add('playerlaser')
        if (playerLaserTimer) return
        playerLaserTimer = setInterval(() => {
          if (playerLaser >= 21) {
            cells[playerLaser].classList.remove('playerlaser')
            playerLaser -= 21
            cells[playerLaser].classList.add('playerlaser')
            console.log(playerLaser)
            return
          } else if (playerLaser <= 21) {
            cells[playerLaser].classList.remove('playerlaser')
            return
          }
        }, 100)

      }
    }

  })

  // FIRE LASER ===================================================
// function fireLaser () {
  
// }





  // COLLISION =================================================================
  // if (playerLaser === aliens) {
  //   cells[playerLaser].classList.remove('playerlaser')
  //   cells[aliens].classList.remove('alien')
  //   cells[explosion].classList.add('explosion')

  // }





  // listens for keys pressed ============================================
  document.addEventListener('keyup', (e) => {
    var keypressed = e.key && e.keyCode
    console.log(keypressed)
  })






}

document.addEventListener('DOMContentLoaded', setupGame)