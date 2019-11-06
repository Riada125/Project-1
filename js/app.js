function setupGame() {


  //declare grid size variables
  let width = 21
  const gridSize = width ** 2
  const grid = document.querySelector('.grid')
  let cells = []
  let player = 409
  let aliens = []


  // declare scoreboard variables
  const scoreBoard = document.querySelector('.score')
  let score = 0

  const aliens2 = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 20, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103]

  // start and end game variables
  const startButton = document.querySelector('.start')
  const gameOverMessage = document.querySelector('.GameOver')
  const finalScore = document.querySelector('.finalscore')
  let startGame = null
  let gameIsEnding = false
  let gameOver = false
  let newGame = false

  // alien movement variables
  let alienMove = 0
  let moveAliens = null


  // Declare Intervals variables
  let alienMovement
  let enemyLaserInterval = []
  let chooseEnemyLaserInterval = []
  let laserInterval = []
  let moveAliensInterval = []


  // hide Game Over message at launch

  gameOverMessage.style.display = 'none'


  // START GAME ===================================
  startButton.addEventListener('click', () => {
    startGame()
  })

  startGame = function () {
    if (gameOver === true && newGame === false) {
      return
    }
    newGame = true
    gameIsEnding = false
    startButton.style.display = 'none'
    gameOverMessage.style.display = 'none'
    cells.forEach(cell => cell.style.display = 'block')
    aliens = [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103]
    alienMove = 1


    //creates grid ========================================
    if (newGame === true) {
      for (let i = 0; i < gridSize; i++) {
        const cell = document.createElement('div')
        grid.appendChild(cell)
        cells.push(cell)
      }
    }

    // Adds player ========================================
    cells[player].classList.add('player')


    // Adds aliens to grid =====================================
    aliens.forEach(element => {
      cells[element].classList.add('aliens')
    })

    // Begins Moving Aliens =====================================
    moveAliens(aliens)

  }

  // CLEAR INTERVALS ==========================================
  function stopIntervals() {
    clearInterval(moveAliensInterval)
    clearInterval(firePlayerLaser)
    clearInterval(enemyLaserInterval)
    clearInterval(chooseEnemyLaserInterval)
    clearInterval(laserInterval)
    clearInterval(alienMovement)
    cells.forEach(cell => cell.classList.remove('player', 'aliens', 'playerlaser', 'enemylaser'))
    cells.forEach(cell => cell.style.display = 'none')
    cells = []
    aliens = []
    alienMove = 0
  }


  // VICTORY =======================================================
  const victory = function () {
    newGame = false
    gameIsEnding = true
    setTimeout(() => {
      stopIntervals()
      gameOverMessage.style.display = 'block'
      gameOver = true
      gameOverMessage.addEventListener('click', () => {
        setupGame()
      })
    }, 2000)
  }

  // DEFEAT =====================================================
  const defeat = function () {
    newGame = false
    gameIsEnding = true
    setTimeout(() => {
      gameOverMessage.style.display = 'block'
      finalScore.innerHTML = `SCORE: ${score}`
      width = 0
      aliens = 0

      stopIntervals()
    }, 2000)
    alienMovement
    enemyLaserInterval = []
    chooseEnemyLaserInterval = []
    laserInterval = []
    moveAliensInterval = []
    gameOver = true
    gameOverMessage.addEventListener('click', () => {
      startGame()
      newGame = true
      gameOver = false
    })
  }

  // Adds event listeners for user key input ===================================
  document.addEventListener('keyup', (e) => {
    if (gameIsEnding) {
      return
    }
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
    }

  })

  // MOVE ALIENS LOGIC ========================================
  moveAliens = function (array) {
    alienMovement = setInterval(() => {
      if (gameOver === true) {
        clearInterval(alienMovement)
      }
      for (let alien = aliens.length - 1; alien >= 0; --alien) {
        cells[aliens[alien]].classList.remove('aliens')
        aliens[alien] += alienMove
        cells[aliens[alien]].classList.add('aliens')
      }

      // left wall is true if the position of first alien in array is divisible by width. e.g if first alien in array is 42 then / 21 = true
      const leftWall = aliens[0] % width === 0

      //right wall is true if last alien in array is divisible by width and leaves a remainder of width -1 (because width array starts at 0) 
      const rightWall = aliens[aliens.length - 1] % width === width - 1

      //move the aliens down if leftWall is true and the previous move was left or if rightWall is true and previous move was right
      if ((leftWall && alienMove === -1) || (rightWall && alienMove === 1)) {
        alienMove = width

        //if the previous move was down, then move right if leftWall is true or left otherwise
      } else if (alienMove === width) {
        if (leftWall) alienMove = 1
        else alienMove = -1
      }

      if (aliens.some(alien => alien >= 420)) {
        alienMove = 0
        cells[player].classList.remove('player')
        cells[player].classList.add('explosion')
        clearInterval(moveAliens)
        clearInterval(moveAliensInterval)
        defeat()
      }

      if (aliens.length === 0) {
        debugger;
        aliens.push(aliens2)
      }

      moveAliensInterval.push(alienMovement)
    }, 1000)
  }


  // FIRE LASER ===================================================
  document.addEventListener('keydown', firePlayerLaser)

  function firePlayerLaser(e) {
    if (gameIsEnding) {
      return
    }
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
    }
  }

  // FIRES ENEMY LASERS ================================================
  const chooseEnemyLaser = setInterval(() => {
    if (aliens.some(alien => alien >= 420) || aliens.length === 0) {
      return
    }
    if (gameOver === true) {
      return
    }
    const enemyLaserFront = aliens.slice(-10)
    let enemyLaser = enemyLaserFront[Math.floor(Math.random() * enemyLaserFront.length)] + width
    cells[enemyLaser].classList.add('enemylaser')

    const enemyLaserTimer = setInterval(() => {
      if (aliens.some(alien => alien >= 400)) {
        cells[enemyLaser].classList.remove('enemylaser')
        clearInterval(enemyLaserTimer)
        return
      } else if (gameOver === true) {
        clearInterval(enemyLaserTimer)
      }
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
        }, 1500)
        defeat()
      } else if (enemyLaser >= 420) {
        clearInterval(enemyLaserTimer)
        setTimeout(() => {
          cells[enemyLaser].classList.remove('enemylaser')
        }, 80)
      }
    }, 150)
    enemyLaserInterval.push(enemyLaserTimer)
    chooseEnemyLaserInterval.push(chooseEnemyLaser)
  }, 500)

  // SCORE ======================================================

  function addScore() {
    score += 25
    return scoreBoard.innerHTML = `SCORE: ${score}`
  }

}

document.addEventListener('DOMContentLoaded', setupGame)