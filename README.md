### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png) General Assembly, Software Engineering Immersive
# SPACE WARS <img src= assets/Explosion.png height=50 width=50 />

## Overview
Space Wars is my first ever front-end development project, produced as part of General Assembly's Immersive Software Engineering Bootcamp. 

My task was to create a grid-based game rendered in the browser that utilised 'vanilla' JavaScript, HTML and CSS.

Given a selection of classic arcade games to choose from, I opted to build my take on _Space Invaders_. The theme was inspired by the _Star Wars_ film saga and used pixel art to evoke the sense of a typical arcade game. The broken, tuneless music used is to reflect the low-budget 'knock-off' feel of the game.

The project was mainly to consolidate my beginners' knowledge of JavaScript and interacting with the DOM, but I worked hard to make it a fun experience to play. 


## The Brief 

- **Render a game in the browser**
- **Design logic for winning & visually display which player won**
- **Include separate HTML / CSS / JavaScript files**
- Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
- Use **Javascript** for **DOM manipulation**
- **Deploy your game online**, where the rest of the world can access it
- Use **semantic markup** for HTML and CSS (adhere to best practices)


## The Technologies used 

- HTML5
- CSS3
- JavaScript (ES6)
- Git and GitHub
- Google Fonts
- Pixel Art
- GarageBand


## The Approach

### The Grid

The game is built using a grid. A 21 x 21 square is created using JavaScript. HTML divs are created using a for loop and appended as children of the grid.

 ```js
  const width = 21
  const gridSize = width ** 2
  const grid = document.querySelector('.grid')
  let cell = []
  let cells = []
  let player = 409
  let aliens = []
 
 
    if (newGame === true) {
      for (let i = 0; i < gridSize; i++) {
        cell = document.createElement('div')
        grid.appendChild(cell)
        cells.push(cell)
      }
    }
 ```
 During actual gameplay, the grid isn't visible, but is highlighed below for demonstration purposes:
 
 ![](./assets/screenshots/GridScreenshot.png)
 
 
### Opponent Movement

Enemy ships are defined as an array of numbers which corresponds to their position on the grid:

```js
aliens = [22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 85, 87, 89, 91, 93, 95, 97, 99, 101, 103]
```

They are then added to the grid using a forEach statement

```js
 aliens.forEach(element => {
      cells[element].classList.add('aliens')
    })
```

Enemy ship movement is initially defined as a global variable of `1`. Using a `setInterval` function, the ships will move one space to the right unless other criteria are met. If the right-most alien in the array moves into the defined right wall, then the ships' move variable is re-assigned and will each move one space down and then continue to move left until the left-most alien encounters the defined left wall and the movement is re-assigned and mirrored. 

I had originally opted to use an ES6 `forEach` Array method to cycle through the array of alien positions, but the difficulty I encountered was that this started at the beginning of the array, at index `0`, meaning that rows of ships would disappear into the ship in front as they were being moved down in ascending order. I corrected this by utilising a `for` loop to move backwards through the array so that the ships in front moved forward first. 


Here I defined a `setInterval` called `alienMovement`. It loops backwards through the alien array, removes the alien CSS class from the specified cell. Increases the movement by the `alienMove` variable and then re-adds the alien.

 ```js
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
      
 ```

Below is how I defined the left and right walls of the grid. The left wall is defined by checking if the left-most alien is exactly divisible by the width, whilst the right wall is defined by checking if the right-most alien is exactly divisble by the width -1:

```js
  const leftWall = aliens[0] % width === 0
  const rightWall = aliens[aliens.length - 1] % width === width - 1
```



Using the defined left and right walls, I reassigned alienMove (the direction that each element of the alien array would move in) based on movement in relation to the walls. If the length of the alien array is zero, the boss battle begins. 

```js
      if ((leftWall && alienMove === -1) || (rightWall && alienMove === 1)) {
        alienMove = width
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
```
 
 

### Opponent Lasers

Enemy lasers are fired every 300 milliseconds using a setInterval. The firing position is randomly determined using `Math.random` based on the position of the 10 aliens that are furthest forward. The `.slice(-10)` method used here means that as the number of aliens in the array decreases, the number of aliens firing reduces - rather than having enemy lasers originating from empty space. 


Below, a `setInterval` is declared. It contains a variable that finds the front 10 of our array of alien ships. `enemyLaser` is then a variable that selects a random position in front of those ships to fire. 

```js
enemyLaserInterval = setInterval(() => {
      const enemyLaserFront = aliens.slice(-10)
      let enemyLaser = enemyLaserFront[Math.floor(Math.random() * enemyLaserFront.length)] + width
```


The `enemyLaser` CSS class is added to the cell in front of the random ship, a sound plays and another setInterval is declared that adds and removes the CSS class until there is collision with the player or the enemy laser reaches the end of the grid. If the enemy laser collides with the player, the player is replaced by an explosion CSS class and the game ends. 

```js
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
 
```
 

![](./assets/screenshots/Screenshot1.png)

### The Player
The player is a variable defined with a number, which defines its position on the grid:

```js
 let player = 409

```

Moving the player comes from an event listener that checks for a `keyup` event on the user's keyboard. I then defined a switch statement that established whether the player's ship would move left, right or fire lasers...

```js
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
			...
			
			
        }, 100)
      }
    }
  })
```

When case 32 is called (keyup on the space bar), the player's laser fires. A variable is assigned to the position that is one space in front of the player on the grid alongside an associated CSS class. This includes a sound playing and the `'playerlaser'` CSS class being moved up the length of the grid, concurrent with the position of the `playerLaser` variable. This also includes logic for removing the laser and an enemy ship whilst increasing the score if there is a collision detected, as well as removing the player's laser if it reaches the end of the grid.

```js
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

```
 

 
 
### 'The Boss'

Once I had completed the basic logic for the game, I wanted to test my new knowledge of Objects in JavaScript and so decided to include a 'boss' level - this took the form of the planet-destroying superweapon, the Death Star. 

I wanted the boss ship to be significantly larger than the previous enemy ships, and so to do this I had to split the image into 16 evenly sized pieces. The boss ship is an array of 16 objects. A shortened example of how these were defined is below.

```js
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
```

As above, each object is assigned a position on the grid and a unique id. The images are then linked through CSS and given an animation to fade into view:


![](./assets/screenshots/Boss1Screenshot.png)


The boss ship elements are added as through a `forEach` function as below:

```js
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
```

As this is inside a `setInterval`, the elements of the ship that are removed by a `playerlaser` regenerate. This was done deliberately so that there would be an effect of multiple explosions occurring and requiring the enemy ship to take repeated damage before a `victory` function is declared. 



![](./assets/screenshots/Boss2Screenshot.png)




## Challenges
- This was my first front-end JavaScript project and assembling all of my knowledge on arrays, control flow, functions, timeouts and intervals and applying them to an entirely blank canvas for the first time was without doubt the biggest challenge faced. In places, the code is lengthy and a little unwieldy, but I have deliberately left much of it like this as way of referencing my ability and understanding at the time of creation (the project was set with a one-week timeframe). I've progressed a lot since completing this project. 

- Moving the alien ships was the single biggest technical challenge. It took me a little while to understand how to correctly define my left and right walls - and tackling the problem of ships moving into each other was a particularly engaging challenge!



## Victories 
- Adding the Death Star was surprisingly easy to implement once I had planned the logic. I was surprised and delighted when it appeared and worked as expected on the first attempt. This taught me a lot about planning and structuring my code coherently in advance, rather than just typing and hoping.

- I'm pleased with the look and feel of the game in terms of its appearance and the sounds and the satisfaction of removing enemy ships. 

- The project really helped to consolidate my knowledge of JavaScript, HTML and CSS and interacting with the DOM. 


## Potential future features

- The Death Star was originally intended to move and fire, but as the project deadline loomed this proved tricky to implement without compromising the ship's dramatic entrance, which was preferable. Ultimately, I'm happy with a stationary boss, but perhaps in future I'll make it a bit more of a threat to the player...

- I'd be keen to make this game mobile friendly. I treated the task as the first try-out of my JavaScript knowledge and so was more concerned with building something that worked on a screen with a keyboard. I'd need to reconsider how the player interacts with the game to make it suitable for smartphone or tablet use.  


## Lessons learned

- Design mobile first. I did this with my follow-up game, [Monkey Tennis](https://github.com/mjadair/Monkey-Tennis)

- Plan better. By the latter stage of the project I was already feeling much more comfortable in implementing my ideas. The boss level worked exactly as I was expecting it to after I planned it out carefully. The previously created elements involved much more trial and error. 