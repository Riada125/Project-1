function setupGame() {

  //declare grid size variables and positions
  const width = 21
  const gridSize = width ** 2
  const grid = document.querySelector('.grid')
  let cell = []
  let cells = []
  let player = 409
  let aliens = []
  let enemyLaserInterval = []

  // start and end game variables
  const startButton = document.querySelector('.start')
  const gameOverMessage = document.querySelector('.GameOver')
  const victoryMessage = document.querySelector('.victory')
  const finalScore = document.querySelector('.finalscore')
  const winningScore = document.querySelector('.winningscore')
  let startGame = null
  let gameIsEnding = false
  let gameOver = false
  let newGame = false

  // declare scoreboard variables
  const scoreBoard = document.querySelector('.score h2')
  let score = 0

  // alien movement variables
  let alienMove = 0

  //declare boss elements
  let bossBattle = []
  let finalBattle = false
  let bossHealth = 500
  let bossMove = []
  const bossHealthID = document.querySelector('.bosshealth')
  const bossShip = [
    {
      position: 97,
      id: 'boss16'
    },
    {
      position: 96,
      id: 'boss15'
    },
    {
      position: 95,
      id: 'boss14'
    },
    {
      position: 94,
      id: 'boss13'
    },
    {
      position: 76,
      id: 'boss12'
    },
    {
      position: 75,
      id: 'boss11'
    },
    {
      position: 74,
      id: 'boss10'
    },
    {
      position: 73,
      id: 'boss9'
    },
    {
      position: 55,
      id: 'boss8'
    },
    {
      position: 54,
      id: 'boss7'
    },
    {
      position: 53,
      id: 'boss6'
    },
    {
      position: 52,
      id: 'boss5'
    },
    {
      position: 34,
      id: 'boss4'
    },
    {
      position: 33,
      id: 'boss3'
    },
    {
      position: 32,
      id: 'boss2'
    },
    {
      position: 31,
      id: 'boss1'
    }
  ]
  // add audio event listeners
  const playerLaserSound = document.querySelector('#playerlasersound')
  const enemyLaserSound = document.querySelector('#enemylasersound')
  enemyLaserSound.volume = 0.3
  const enemyFlyingSound = document.querySelector('#enemyflyingsound')
  const explosionSound = document.querySelector('#explosion')
  explosionSound.volume = 0.5
  const playerExplosion = document.querySelector('#playerexplosion')
  let enemyFlyingSoundTimer = []
  const noMoon = document.querySelector('#nomoon')
  const bossTheme = document.querySelector('#bosstheme')
  const playerNoise = document.querySelector('#playernoise')
  const themeMusic = document.querySelector('#thememusic')

  // hide end messages at launch
  gameOverMessage.style.display = 'none'
  victoryMessage.style.display = 'none'
  scoreBoard.style.display = 'none'





  // START GAME ===================================
  startButton.addEventListener('click', () => {
    startGame()
    themeMusic.volume = 0.8
    themeMusic.play()
  })

  startGame = function () {
    if (gameOver === true && newGame === false) {
      return
    }
    newGame = true
    gameIsEnding = false
    startButton.style.display = 'none'
    gameOverMessage.style.display = 'none'
    victoryMessage.style.display = 'none'
    scoreBoard.style.display = 'block'
    scoreBoard.innerHTML = `SCORE: ${score}`
    aliens = [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103]
    alienMove = 1

    // play enemy flying sounds on a loop
    enemyFlyingSound.play()

    enemyFlyingSoundTimer = setInterval(() => {
      enemyFlyingSound.play()
    }, 10000)
    //creates grid ========================================
    if (newGame === true) {
      for (let i = 0; i < gridSize; i++) {
        cell = document.createElement('div')
        grid.appendChild(cell)
        cells.push(cell)
      }
    }
    // Adds player to grid ========================================
    cells[player].classList.add('player')
    // Adds aliens to grid =====================================
    aliens.forEach(element => {
      cells[element].classList.add('aliens')
    })
    // Adds Boss ship  and battle function ============================================
    bossBattle = function () {
      bossHealth = 500
      bossHealth = Math.max(0, bossHealth)
      bossHealthID.innerHTML = `DEATH STAR HEALTH: ${bossHealth}`
      clearInterval(enemyFlyingSoundTimer)
      finalBattle = true
      setTimeout(() => {
        noMoon.play()
      }, 200)
      setTimeout(() => {
        bossTheme.play()
        gameIsEnding = false
      }, 1000)

      const bossMovement = setInterval(() => {
        if (gameOver) {
          clearInterval(bossMovement)
          return
        }

        if (bossHealth <= 0) {
          clearInterval(bossMovement)
          victory()
          return
        }
        bossShip.forEach(i => {
          cells[i.position].classList.add(i.id)
          if (cells[i.position].classList.contains('playerlaser') === true) {
            cells[i.position].classList.remove(i.id)
            cells[i.position].classList.add('explosion')
            addScore()
            bossScore()
            playerExplosion.pause()
            playerExplosion.currentTime = 0
            playerExplosion.play()
          }
        })
      }, 600)
    }
    // MOVE ALIENS========================================
    const alienMovement = setInterval(() => {
      if (gameIsEnding === true || gameOver === true) {
        clearInterval(alienMovement)
        return
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
        aliens = 420
        cells[player].classList.remove('player')
        cells[player].classList.add('explosion')
        defeat()
        return
      }
      if (aliens.length === 0) {
        bossBattle()
        clearInterval(alienMovement)
      }
    }, 1000)
    // FIRES ENEMY LASERS ================================================
    enemyLaserInterval = setInterval(() => {
      if (gameIsEnding === true || gameOver === true || finalBattle === true) {
        return
      }
      const enemyLaserFront = aliens.slice(-10)
      let enemyLaser = enemyLaserFront[Math.floor(Math.random() * enemyLaserFront.length)] + width
      cells[enemyLaser].classList.add('enemylaser')
      enemyLaserSound.play()
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
        // if (cells[enemyLaser].classList.contains('aliens') === true) { }
        if (cells[enemyLaser].classList.contains('player') === true) {
          clearInterval(enemyLaserTimer)
          cells[enemyLaser].classList.remove('enemylaser', 'player')
          cells[player].classList.add('explosion')
          setTimeout(() => {
            cells[player].classList.remove('explosion')
          }, 1500)
          defeat()
          clearInterval(enemyLaserTimer)
          return
        } else if (enemyLaser >= 420) {
          clearInterval(enemyLaserTimer)
          setTimeout(() => {
            cells[enemyLaser].classList.remove('enemylaser')
          }, 80)
        }
      }, 150)
    }, 300)
  }
  // CLEAR INTERVALS ==========================================
  function stopIntervals() {
    clearInterval(enemyLaserInterval)
    clearInterval(enemyFlyingSoundTimer)
    clearInterval(bossMove)
    bossMove = []
    cells.forEach(cell => {
      grid.removeChild(cell)
    })
    cells = []
    return
  }
  // VICTORY =======================================================
  const victory = function () {
    playerNoise.play()
    newGame = false
    gameIsEnding = true
    bossHealthID.innerHTML = ''
    grid.style.background = 'url(\'assets/hyperspace.gif\')'
    grid.style.backgroundSize = 'cover'
    setTimeout(() => {
      scoreBoard.style.display = 'none'
      victoryMessage.style.display = 'block'
      winningScore.innerHTML = `FINAL SCORE: ${score}`
      stopIntervals()
    }, 200)
    aliens = []
    gameOver = true
    victoryMessage.addEventListener('click', () => {
      startGame()
      scoreReset()
      grid.style.background = 'url(\'assets/Starrysky.jpg\')'
      grid.style.backgroundSize = 'cover'
      newGame = true
      gameOver = false
      finalBattle = false
    })
  }
  // DEFEAT =====================================================
  const defeat = function () {
    scoreBoard.style.display = 'none'
    newGame = false
    gameIsEnding = true
    playerExplosion.play()
    enemyFlyingSound.play()
    setTimeout(() => {
      scoreBoard.style.display = 'none'
      gameOverMessage.style.display = 'block'
      finalScore.innerHTML = `FINAL SCORE: ${score}`
      stopIntervals()
    }, 2000)
    aliens = [420]
    gameOver = true
    gameOverMessage.addEventListener('click', () => {
      startGame()
      scoreReset()
      newGame = true
      gameOver = false

    })
  }
  // Adds event listeners for user key input ===================================
  document.addEventListener('keyup', (e) => {
    if (gameIsEnding || newGame === false) {
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
      case 32: {
        playerLaserSound.pause()
        playerLaserSound.currentTime = 0
        playerLaserSound.play()
        let playerLaser = [player - width]
        cells[playerLaser].classList.add('playerlaser')
        const playerLaserTimer = setInterval(() => {
          cells[playerLaser].classList.remove('playerlaser')
          playerLaser -= width
          if (gameOver) {
            clearInterval(playerLaserTimer)
          }
          if (playerLaser <= 0) {
            clearInterval(playerLaserTimer)
          } else if (cells[playerLaser].classList.contains('aliens') === true) {
            clearInterval(playerLaserTimer)
            const alienDeath = aliens.indexOf(playerLaser)
            aliens.splice(alienDeath, 1)
            cells[playerLaser].classList.remove('playerlaser', 'aliens')
            cells[playerLaser].classList.add('explosion')
            explosionSound.pause()
            explosionSound.currentTime = 0
            explosionSound.play()
            setTimeout(() => {
              cells[playerLaser].classList.remove('explosion')
            }, 200)
            addScore()
          } else if (playerLaser > -1) {
            cells[playerLaser].classList.add('playerlaser')
          }
        }, 100)
      }
    }
  })
  // SCORE ======================================================
  function addScore() {
    score += 25
    return scoreBoard.innerHTML = `SCORE: ${score}`
  }
  // BOSS SCORE =======================================
  function bossScore() {
    score += 100
    bossHealth -= 10
    return bossHealthID.innerHTML = `DEATH STAR HEALTH: ${bossHealth}`
  }
  // score reset ==================================
  function scoreReset() {
    score = 0
  }
}
document.addEventListener('DOMContentLoaded', setupGame)