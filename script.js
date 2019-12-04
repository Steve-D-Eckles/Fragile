// remove the start button; add the navigation buttons
const gameStart = () => {
  const navList = ['forest', 'gambler', 'vault', 'drain']
  // create the nav buttons
  for (let i = 0; i < 4; i++) {
    const arrow = document.createElement('p')
    arrow.classList.add('arrow')
    if (i < 2) {
      arrow.style.top = 320 + i * 110 + 'px'
      arrow.style.left = 100 + 'px'
    } else {
      arrow.style.top = 100 + i * 110 + 'px'
      arrow.style.left = 800 + 'px'
    }
    arrow.classList.add(navList[i])
    arrow.textContent = navList[i]
    arrow.addEventListener('click', travel)
    document.body.getElementsByTagName('main')[0].appendChild(arrow)
  }
  // explode the start button
  start.removeEventListener('click', gameStart)
  start.style.visibility = 'hidden'
  const placeHolder = document.createElement('p')
  placeHolder.style.fontSize = '5rem'
  placeHolder.textContent = '💥'
  placeHolder.style.position = 'absolute'
  placeHolder.style.top = '310px'
  main.appendChild(placeHolder)
  setTimeout(() => {
    placeHolder.remove()
  }, 325)
}

const start = document.getElementById('start')
const main = document.body.children[0]
start.addEventListener('click', gameStart)
// draw memory game table
// when button is clicked, make a div with class of "overlay" that contains the game

// create a div with a class of "overlay"
const overlay = document.createElement('div')

function travel (event) {
  // create div
  // give it a class "overlay"
  overlay.classList.add('overlay')
  main.appendChild(overlay)
  // determine the game being played
  const targetClasses = Array.from(event.target.classList)
  if (targetClasses.includes('forest')) {
    // call "forest" function
    forest()
  }
}

function forest () {
  overlay.style.backgroundColor = 'green'
  // list of pairs for the game
  const arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
  let turn = 0
  let attempts = 15
  let prevTarget
  let delayFlag = false
  // create the table for the game
  const table = document.createElement('table')
  for (let i = 0; i < 4; i++) {
    const row = document.createElement('tr')
    for (let n = 0; n < 4; n++) {
      const tile = document.createElement('td')
      // assign a value to each tile randomly from the list
      tile.textContent = arr.splice(Math.floor(Math.random() * arr.length), 1)
      tile.addEventListener('click', event => {
        if (!delayFlag) {
          // reveal the value when clicked
          event.target.classList.add('flipped')
          // on the first turn, get the value of the selected tile
          if (turn === 0) {
            turn++
            prevTarget = event.target
          } else {
            turn = 0
            attempts--
            // on the second turn, check that the values match
            // if they do, keep them revealed. If not, hide them again
            if (event.target.textContent !== prevTarget.textContent) {
              delayFlag = true
              setTimeout(() => {
                event.target.classList.remove('flipped')
                prevTarget.classList.remove('flipped')
                delayFlag = false
              }, 500)
            } else prevTarget = undefined // clear the previous target
          }
        }
      })
      row.appendChild(tile)
    }
    table.appendChild(row)
  }
  overlay.appendChild(table)
}
