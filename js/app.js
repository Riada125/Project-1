function setupGame() {

  const width = 21
  const gridSize = width ** 2
  const grid = document.querySelector('.grid')
  const cells = []
  let player = 430
  const aliens = [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103]

  const scoreBoard = document.querySelector('.score')
  let score = 0
  const startButton = document.querySelector('.start')
  let startGame = null
  let endGame = null





  // START GAME ===================================
  startButton.addEventListener('click', () => {
    startGame()
  })


  startGame = function () {

    startButton.style.display = 'none'


    // MOVE ALIENS ===============================================================

    function moveAliens() {
      let alienMove = 1
      const moveAliensInterval = setInterval(() => {
        debugger;
        for (let alien = aliens.length - 1; alien >= 0; --alien) {
          cells[aliens[alien]].classList.remove('aliens')
          aliens[alien] += alienMove
          cells[aliens[alien]].classList.add('aliens')
        }


        //WHY DOESN'T THIS WORK?
        // aliens.forEach((alien) => {
        //   cells[aliens[alien]].classList.remove('aliens')
        //   aliens[alien] += alienMove
        //   cells[aliens[alien]].classList.add('aliens')
        // })


        // left wall is true if the position of first alien in array is divisible by width. e.g if first alien in array is 42 then / 21 = true
        const leftWall = aliens[0] % width === 0


        //right wall is true if last alien in array is divisible by width and leaves a remainder of width -1 (because width array starts at 0) and 
        const rightWall = aliens[aliens.length - 1] % width === width - 1
        // console.log(aliens[aliens.length - 1])
        // console.log(aliens[aliens.length - 1] % width)




        //move the aliens down if leftWall is true and the previous move was left or if rightWall is true and previous move was right
        if ((leftWall && alienMove === -1) || (rightWall && alienMove === 1)) {
          alienMove = width

          //if the previous move was down, then move right if leftWall is true or left otherwise
        } else if (alienMove === width) {
          if (leftWall) alienMove = 1
          else alienMove = -1
        }

        if (aliens.some(alien => alien >= 420)) {
          alert('You have lost the game!')
          clearInterval(moveAliensInterval)
        }

      }, 500)
    }
    //moveAliens()







    //creates grid ========================================
    for (let i = 0; i < gridSize; i++) {
      const cell = document.createElement('div')
      grid.appendChild(cell)
      cells.push(cell)
    }



    // Adds player ========================================
    cells[player].classList.add('player')




    // Adds aliens to grid =====================================
    aliens.forEach(element => {
      cells[element].classList.add('aliens')
    })

    // SCORE ======================================================

    function addScore() {
      score += 25
      return scoreBoard.innerHTML = `SCORE: ${score}`
    }



    // Adds event listeners for user key input ===================================
    document.addEventListener('keyup', (e) => {
      switch (e.keyCode) {
        case 37: {
          if (player === 420 || player === 399) {
            return
          }
          cells[player].classList.remove('player')
          player = player - 1
          cells[player].classList.add('player')
          break
        }
        case 39: {
          if (player === ((gridSize) - 1) || player === 419) {
            return
          }
          cells[player].classList.remove('player')
          player = player + 1
          cells[player].classList.add('player')
          break
        }
        case 38: {
          if (player <= 419) {
            return
          }
          cells[player].classList.remove('player')
          player = player - width
          cells[player].classList.add('player')
          break
        }
        case 40: {
          if (player >= 420) {
            return
          }
          cells[player].classList.remove('player')
          player = player + width
          cells[player].classList.add('player')
          break
        }

      }

    })


    // FIRES ENEMY LASERS ================================================
    let enemyLaserInterval = []

    const chooseEnemyLaser = setInterval(() => {
      const enemyLaserFront = aliens.slice(-10)
      let enemyLaser = enemyLaserFront[Math.floor(Math.random() * enemyLaserFront.length)] + width
      cells[enemyLaser].classList.add('enemylaser')
      const enemyLaserTimer = setInterval(() => {
        cells[enemyLaser].classList.remove('enemylaser')
        enemyLaser += width
        cells[enemyLaser].classList.add('enemylaser')
        // if (cells[enemyLaser].classList.contains('aliens') === true) {
        // }
        if (cells[enemyLaser].classList.contains('player') === true) {
          clearInterval(enemyLaserTimer)
          cells[enemyLaser].classList.remove('enemylaser', 'player')
          cells[player].classList.add('explosion')
          setTimeout(() => {
            cells[player].classList.remove('explosion')
          }, 200)
        } else if (enemyLaser >= 420) {
          clearInterval(enemyLaserTimer)
          setTimeout(() => {
            cells[enemyLaser].classList.remove('enemylaser')
          }, 80)

        }
      }, 150)
      enemyLaserInterval.push(enemyLaserTimer)
      //console.log(enemyLaserInterval)
    }, 500)



    // FIRE LASER ===================================================
    const laserInterval = []

    document.addEventListener('keydown', firePlayerLaser)

    function firePlayerLaser(e) {
      if (e.keyCode === 32) {
        let playerLaser = [player - width]  //sets the laser
        cells[playerLaser].classList.add('playerlaser')
        const playerLaserTimer = setInterval(() => {
          cells[playerLaser].classList.remove('playerlaser')
          playerLaser -= width
          if (playerLaser <= 0) {
            clearInterval(playerLaserTimer)
          } else if (cells[playerLaser].classList.contains('aliens') === true) {
            clearInterval(playerLaserTimer)
            const alienDeath = aliens.indexOf(playerLaser)
            aliens.splice(alienDeath, 1)
            cells[playerLaser].classList.remove('playerlaser', 'aliens')
            cells[playerLaser].classList.add('explosion')
            setTimeout(() => {
              cells[playerLaser].classList.remove('explosion')
            }, 200)
            addScore()
          } else if (playerLaser > -1) {
            cells[playerLaser].classList.add('playerlaser')
          }
        }, 100)
        laserInterval.push(playerLaserTimer)
        //  console.log(laserInterval)
      }
    }





    // CLEARING INTERVALS =========================================================












  }
}


// listens for keys pressed ============================================
document.addEventListener('keyup', (e) => {
  const keypressed = e.key && e.keyCode
  console.log(keypressed)
})




document.addEventListener('DOMContentLoaded', setupGame)