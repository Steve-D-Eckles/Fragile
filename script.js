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
  if (targetClasses.includes('gambler')) {
    gambler()
  }
}

function forest () {
  // list of pairs for the game
  let arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
  let turn = 0
  let attempts = 15
  let prevTarget
  let delayFlag = false

  // create a sidebar with attempt countdown, win/loss announce, and exit button
  const sidebar = document.createElement('div')
  sidebar.classList.add('sidebar')

  const attemptCounter = document.createElement('p')
  attemptCounter.classList.add('attempts')
  attemptCounter.textContent = `Remaining attempts:\n${attempts}`
  sidebar.appendChild(attemptCounter)

  const objective = document.createElement('p')
  objective.classList.add('objective')
  objective.textContent = 'Start Button Piece Available!'
  sidebar.appendChild(objective)

  const restartButton = document.createElement('button')
  restartButton.classList.add('restart')
  restartButton.textContent = 'Restart'
  restartButton.addEventListener('click', () => {
    arr = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]
    attempts = 15
    prevTarget = undefined
    delayFlag = false
    attemptCounter.textContent = `Remaining attempts:\n${attempts}`
    objective.textContent = 'Start Button Piece Available!'
    const table = Array.from(document.getElementsByTagName('table'))
    for (const elem of table) {
      elem.remove()
    }
    createTable()
  })
  sidebar.appendChild(restartButton)

  const exitButton = document.createElement('button')
  exitButton.classList.add('exit')
  exitButton.textContent = 'Head Back'
  exitButton.addEventListener('click', removeOverlay)
  sidebar.appendChild(exitButton)

  // create the table for the game
  const createTable = () => {
    const table = document.createElement('table')
    for (let i = 0; i < 4; i++) {
      const row = document.createElement('tr')
      for (let n = 0; n < 4; n++) {
        const tile = document.createElement('td')
        const span = document.createElement('span')
        // assign a value to each tile randomly from the list
        span.textContent = arr.splice(Math.floor(Math.random() * arr.length), 1)
        tile.appendChild(span)
        tile.addEventListener('click', event => {
          let classes = []
          if (event.target.firstChild.classList) {
            classes = Array.from(event.target.firstChild.classList)
          }
          if (!delayFlag && !classes.includes('flipped')) {
            // reveal the value when clicked
            event.target.firstChild.classList.add('flipped')
            // on the first turn, get the value of the selected tile
            if (turn === 0) {
              turn++
              prevTarget = event.target.firstChild
            } else {
              turn = 0
              // on the second turn, check that the values match
              // if they do, keep them revealed. If not, hide them again
              if (event.target.firstChild.textContent !== prevTarget.textContent) {
                delayFlag = true
                setTimeout(() => {
                  event.target.firstChild.classList.remove('flipped')
                  prevTarget.classList.remove('flipped')
                  delayFlag = false
                }, 500)
              } else {
                arr.push(prevTarget.textContent)
                if (arr.length === 8) {
                  objective.textContent = 'Button Piece\nRetrieved!'
                  delayFlag = true
                }
                prevTarget = undefined // clear the previous target
              }
              // count down remaining attempts
              attempts--
              attemptCounter.textContent = `Remaining attempts:\n${attempts}`
              // check for loss
              if (attempts === 0 && arr.length < 8) {
                objective.textContent = 'You\nLost!'
                setTimeout(() => {
                  delayFlag = true
                }, 501)
              }
            }
          }
        })
        row.appendChild(tile)
      }
      table.appendChild(row)
    }
    overlay.appendChild(table)
    overlay.appendChild(sidebar)
  }
  createTable()
}

function removeOverlay () {
  while (overlay.firstChild) {
    overlay.firstChild.remove()
  }
  overlay.remove()
}

function gambler () {
  // Add "Wanna Play?" button
  const button = document.createElement('button')
  button.innerHTML = "Wanna play?";
  overlay.appendChild(button)
  // Make two (maybe 4) squares once the "Wanna Play?" button is clicked
    // Remove the "Wanna play?" button, make the squares
  button.addEventListener('click', removeButton)
  function removeButton (event) {
    button.remove()
  }
}
