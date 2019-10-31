function setupGame() {
  const width = 10
  const gridSize = width ** 2
  const grid = document.querySelector('.grid')
  const cells = []
  let player = 5

  for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement('div')
    grid.appendChild(cell)
    cell.addEventListener('click', () => {
      cell.classList.toggle('player')
    })
    cells.push(cell)
  }

  cells[player].classList.add('player')

  document.addEventListener('keyup', (e) => {
    switch (e.key) {
      case 'w': {
        if (player < width) {
          return
        }
        cells[player].classList.remove('player')
        player = player - width
        cells[player].classList.add('player')
        break
      }
      case 's': {
        if (player > ((gridSize) - width - 1)) {
          return
        }
        cells[player].classList.remove('player')
        player = player + width
        cells[player].classList.add('player')
        console.log(player)
        break
      }
      case 'a': {
        if (player === 0) {
          return
        }
        cells[player].classList.remove('player')
        player = player - 1
        cells[player].classList.add('player')
        break
      }
      case 'd': {
        if (player === ((gridSize) - 1)) {
          return
        }
        cells[player].classList.remove('player')
        player = player + 1
        cells[player].classList.add('player')
        break
      }
    }

  })

}

document.addEventListener('DOMContentLoaded', setupGame)
