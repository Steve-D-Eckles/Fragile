const start = document.getElementById('start')
const main = document.body.children[0]
const infoBox = document.createElement('p')
const collected = []
start.addEventListener('click', gameStart)

// remove the start button; add the navigation buttons
function gameStart () {
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
    arrow.addEventListener('mouseenter', navInfo)
    arrow.addEventListener('mouseleave', statusUpdate)
    arrow.addEventListener('click', travel)
    main.appendChild(arrow)
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

  infoBox.setAttribute('id', 'info')
  infoBox.textContent = 'Whoa!'
  main.appendChild(infoBox)

  setTimeout(() => {
    placeHolder.remove()
    infoBox.textContent = "Looks like you hit that button a bit too hard! You'd " +
    "better go collect the pieces. I've added some signs indicating where they ended up. " +
    "Hover over each one and I'll tell you some more about it."
  }, 500)
}

// create an overlay div
const overlay = document.createElement('div')
// flag to prevent attempting to open multiple games
let currentlyPlaying = false

function navInfo (event) {
  const tarClass = event.target.classList[1]
  if (tarClass === 'forest') {
    infoBox.textContent = 'That way leads to the forest! The sprites there probably ' +
    'grabbed the piece. They love to play games though, so they\'ll probably give it ' +
    'to you if you play something with them.'
  } else if (tarClass === 'gambler') {
    infoBox.textContent = "That way leads to the gambler's house. He's got a serious " +
    "problem, so he'll probably let you win the piece in a game."
  } else if (tarClass === 'vault') {
    infoBox.textContent = "That's the entrance to the vault. The guards lock anything " +
    "that looks valuable in there, but they'll probably let you in to grab the piece if you ask nicely."
  } else if (tarClass === 'drain') {
    infoBox.textContent = 'Looks like one of the pieces just fell down that drain. ' +
    "Guess you'll have to fish it out."
  }
}

function statusUpdate () {
  infoBox.textContent = `Looks like you've still got ${4 - collected} pieces to find.`
}

function travel (event) {
  if (!currentlyPlaying) {
    currentlyPlaying = true
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
    if (targetClasses.includes('vault')) {
      vault()
    }
    if (targetClasses.includes('drain')) {
      drain()
    }
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
    removeTable()
    createMemoryTable()
  })
  sidebar.appendChild(restartButton)

  const exitButton = document.createElement('button')
  exitButton.classList.add('exit')
  exitButton.textContent = 'Head Back'
  exitButton.addEventListener('click', removeOverlay)
  sidebar.appendChild(exitButton)

  // create the table for the game
  const createMemoryTable = () => {
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
  createMemoryTable()
}

function removeOverlay () {
  while (overlay.firstChild) {
    overlay.firstChild.remove()
  }
  overlay.remove()
  currentlyPlaying = false
}

function removeTable () {
  const table = Array.from(document.getElementsByTagName('table'))
  for (const elem of table) {
    elem.remove()
  }
}

function winCheck (state) {
  const solution = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '']
  for (let i = 0; i < solution.length; i++) {
    if (state[i] !== solution[i]) return false
  }
  return true
}

function gambler () {
  // Add "Wanna Play?" button
  const button = document.createElement('button')
  button.classList.add('gambler-button')
  button.innerHTML = "Wanna play?";
  overlay.appendChild(button)
  // Make two (maybe 4) squares once the "Wanna Play?" button is clicked
    // Remove the "Wanna play?" button, make the squares
  // This runs an unnamed function
  let total = 0
  let points = 0
// sidebar starts here
  const sidebar = document.createElement('div')
  sidebar.classList.add('sidebar')

  const objective = document.createElement('p')
  objective.classList.add('objective')
  objective.textContent = 'Start Button Piece Available!'
  sidebar.appendChild(objective)

  const restartButton = document.createElement('button')
  restartButton.classList.add('restart')
  restartButton.textContent = 'Restart'
  restartButton.addEventListener('click', () => {
    total = 0
    points = 0
    objective.textContent = 'Start Button Piece Available!'
    document.getElementById('gambler-display').remove()
    drawGame()
  })
  sidebar.appendChild(restartButton)

  const exitButton = document.createElement('button')
  exitButton.classList.add('exit')
  exitButton.textContent = 'Head Back'
  exitButton.addEventListener('click', removeOverlay)
  sidebar.appendChild(exitButton)
  // sidebar ends here

  const drawGame = () => {
    const gamblerGame = document.createElement('div')
    gamblerGame.classList.add('gambler-game')
    const gamblerTotal = document.createElement('div')
    gamblerTotal.classList.add('gambler-total')
    const gamblerDisplay = document.createElement('div')
    gamblerDisplay.setAttribute('id', 'gambler-display')
    gamblerGame.appendChild(gamblerTotal)
    for (let i = 0; i < 1; i++) {
      const gamblerDice = document.createElement('div')
      gamblerDice.classList.add('gambler-dice')
      for (let n = 0; n < 2; n++) {
        const gamblerSquare = document.createElement('p')
        gamblerSquare.classList.add('gambler-square'+n)
        // the following 2 lines insert random numbers into the squares
        gamblerSquare.textContent = Math.floor(Math.random()*6) + 1
        total += Number(gamblerSquare.textContent)

        gamblerDice.appendChild(gamblerSquare)
      }
      gamblerGame.appendChild(gamblerDice)
    }

    gamblerTotal.textContent = total

    const gambleButtons = document.createElement('div')
    gambleButtons.classList.add('gamble-buttons')

    const gambleButtonLow = document.createElement('button')
    gambleButtonLow.classList.add('gamble-low')
    gambleButtonLow.textContent = "Guess lower"
    gambleButtonLow.addEventListener('click', checkGuess)

    const gambleButtonHigh = document.createElement('button')
    gambleButtonHigh.classList.add('gamble-high')
    gambleButtonHigh.textContent = "Guess higher"
    gambleButtonHigh.addEventListener('click', checkGuess)

    gambleButtons.appendChild(gambleButtonLow)
    gambleButtons.appendChild(gambleButtonHigh)

    gamblerDisplay.appendChild(gamblerGame)
    gamblerDisplay.appendChild(gambleButtons)
    overlay.appendChild(gamblerDisplay)
    overlay.appendChild(sidebar)
  }


  button.addEventListener('click', () => {
    total = 0
    button.remove()
    drawGame()
  })

  // define variables used in the "checkGuess" and "generate" functions
  let guess = 0;
  function checkGuess (event) {
    //console.log("NEEDS WORK")

    // if "gamble-low" is clicked and the next roll is lower, award a point
    // if "gamble-low" is clicked and the next roll is higher, set points to zero
    // if "gamble-high" is clicked and the next roll is higher, award a point
    // if "gamble-high" is clicked and the next roll is lower, set points to zero
    const gamblerTotal = document.getElementsByClassName('gambler-total')[0]
    total = Number(gamblerTotal.textContent)
    const square0 = document.querySelector(".gambler-square0")
    const square1 = document.querySelector(".gambler-square1")
    square0.textContent = Math.floor(Math.random()*6) + 1
    square1.textContent = Math.floor(Math.random()*6) + 1
    const newTotal = Number(square0.textContent) + Number(square1.textContent)
    gamblerTotal.textContent = newTotal
    const gambleChoice = Array.from(event.target.classList)



    if (gambleChoice.includes('gamble-low')) {
      guess = 0
      //console.log(guess)
      console.log(total)
      console.log(newTotal)
      // if "newTotal" < "total" AND "guess" = 0, award a point
      if (newTotal < total) {
        points ++;
      }
      if (newTotal >= total) {
        points = 0
      }
      objective.textContent = 'You correctly guessed ' + points + ' out of 5 times in a row!'
      console.log("points = " + points)
      // if "newTotal" >= "total" AND "guess" = 0, set points to zero
    }
    // if "gamble-high" is clicked, set "guess" to 1
    if (gambleChoice.includes('gamble-high')) {
      guess = 1
      //console.log(guess)
      console.log(total)
      console.log(newTotal)
      // if "newTotal" < "total" AND "guess" = 1, set points to zero
      if (newTotal <= total) {
        points = 0
      }
      // if "newTotal" > "total" AND "guess" = 1, award a point
      if (newTotal > total) {
        points ++
      }
      objective.textContent = 'You correctly guessed ' + points + ' out of 5 times in a row!'
      console.log("points = " + points)
    }
    console.log(guess)
    // store "total" in "old-total"
    // roll "total"
    // compare

    // win condition goes here
    if (points >= 5) {
      objective.textContent = 'You won!'
      // finish the win condition
    }
  }
}

function vault () {
  // define starting configuration
  const slideShuffle = () => {
    const start = ['', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    const state = []
    while (start.length > 0) {
      state.push(String(start.splice(Math.random() * start.length, 1)))
    }
    let inversions = 0
    const filtered = state.filter(a => a !== '').map(a => Number(a))
    for (const elem of filtered) {
      inversions += filtered.filter(a => filtered.indexOf(a) > filtered.indexOf(elem) && a < elem).length
    }
    const index = state.indexOf('')
    const line = ((index >= 0 && index < 4) || (index > 7 && index < 12)) ? 0 : 1
    return line % 2 + inversions % 2 === 1 ? state : slideShuffle()
  }
  let state = slideShuffle()
  // create a sidebar with status, reset, and exit
  const sidebar = document.createElement('div')
  sidebar.classList.add('sidebar')

  const objective = document.createElement('p')
  objective.classList.add('objective')
  objective.textContent = 'Start Button Piece Available!'
  sidebar.appendChild(objective)

  const restartButton = document.createElement('button')
  restartButton.classList.add('restart')
  restartButton.textContent = 'Restart'
  restartButton.addEventListener('click', () => {
    objective.textContent = 'Start Button Piece Available!'
    removeTable()
    state = slideShuffle()
    createVaultTable()
  })
  sidebar.appendChild(restartButton)

  const exitButton = document.createElement('button')
  exitButton.classList.add('exit')
  exitButton.textContent = 'Head Back'
  exitButton.addEventListener('click', removeOverlay)
  sidebar.appendChild(exitButton)

  // create the table
  const createVaultTable = () => {
    let index = 0
    const table = document.createElement('table')
    for (let i = 0; i < 4; i++) {
      const row = document.createElement('tr')
      for (let n = 0; n < 4; n++) {
        const tile = document.createElement('td')
        tile.textContent = state[index]
        index++
        tile.addEventListener('click', event => {
          const tarIndex = state.indexOf(event.target.textContent)
          const check = []
          const leftEdge = [4, 8, 12]
          const rightEdge = [3, 7, 11]
          if (leftEdge.includes(tarIndex)) {
            check.push(state[tarIndex + 1])
            check.push(state[tarIndex - 4])
            check.push(state[tarIndex + 4])
          } else if (rightEdge.includes(tarIndex)) {
            check.push(state[tarIndex - 1])
            check.push(state[tarIndex - 4])
            check.push(state[tarIndex + 4])
          } else {
            for (let i = 1; i < 5; i += 3) {
              check.push(state[tarIndex + i])
              check.push(state[tarIndex - i])
            }
          }
          if (check.includes('')) {
            const temp = state[tarIndex]
            state[state.indexOf('')] = temp
            state[tarIndex] = ''
            if (winCheck(state)) {
              objective.textContent = 'You\nWon!'
              state[15] = '16'
            }
            removeTable()
            createVaultTable()
          }
        })
        row.appendChild(tile)
      }
      table.appendChild(row)
    }
    overlay.appendChild(table)
    overlay.appendChild(sidebar)
  }
  createVaultTable()
}

function drain () {
  const sidebar = document.createElement('div')
  sidebar.classList.add('sidebar')

  const objective = document.createElement('p')
  objective.classList.add('objective')
  objective.textContent = collected.includes('drain') ? 'Piece already collected.' : 'Start Button Piece Available!'
  sidebar.appendChild(objective)

  const restartButton = document.createElement('button')
  restartButton.classList.add('restart')
  restartButton.textContent = 'Restart'
  restartButton.addEventListener('click', () => {
    objective.textContent = collected.includes('drain') ? 'Piece already collected.' : 'Start Button Piece Available!'
    document.getElementById('maze').remove()
    createMaze()
  })
  sidebar.appendChild(restartButton)

  const exitButton = document.createElement('button')
  exitButton.classList.add('exit')
  exitButton.textContent = 'Head Back'
  exitButton.addEventListener('click', removeOverlay)
  sidebar.appendChild(exitButton)

  const createMaze = () => {
    let x = 0
    let y = 0
    const maze = document.createElement('div')
    maze.setAttribute('id', 'maze')
    const piece = document.createElement('div')
    piece.setAttribute('id', 'maze-piece')
    piece.textContent = '⭐'
    piece.addEventListener('click', () => {
      piece.classList.add('grabbed')
    })
    window.addEventListener('mousemove', event => {
      const classArr = Array.from(piece.classList)
      if (classArr.includes('grabbed')) {
        x = x + event.movementX
        y = y - event.movementY
        piece.style.bottom = y + 'px'
        piece.style.left = x + 'px'
        if ((x >= 360 && x < 390) && (y >= 350 && y < 385)) {
          piece.classList.remove('grabbed')
          piece.remove()
          if (!collected.includes('drain')) {
            collected.push('drain')
            objective.textContent = 'Start button piece retrieved!'
          } else {
            objective.textContent = 'You Win!'
          }
        } else if ((x < 0 || x > 390) || (y < 0 || y > 385) ||
                  ((y > 9 && y < 77) && x < 380) ||
                  ((y > 89 && y < 157) && x > 10) ||
                  ((y > 169 && y < 237) && x < 380) ||
                  ((y > 249 && y < 317) && x > 10) ||
                  ((y < 376 && y > 318) && (x > 48 && x < 118)) ||
                  (y > 327 && (x > 128 && x < 198)) ||
                  ((y < 376 && y > 318) && (x > 208 && x < 278)) ||
                  (y > 327 && (x > 288 && x < 358))) {
          piece.classList.remove('grabbed')
          x = 0
          y = 0
          piece.style.bottom = '0px'
          piece.style.left = '0px'
        }
      }
    })
    maze.appendChild(piece)

    const goal = document.createElement('div')
    goal.classList.add('goal')
    maze.appendChild(goal)
    let alt = 0
    for (let i = 30; i < 350; i += 80) {
      const obstacle = document.createElement('div')
      obstacle.classList.add('obstacle')
      obstacle.style.bottom = i + 'px'
      obstacle.style.left = alt + 'px'
      alt = alt === 0 ? 30 : 0
      maze.appendChild(obstacle)
    }
    alt = 0
    for (let i = 50; i < 370; i += 80) {
      const topstacle = document.createElement('div')
      topstacle.classList.add('topstacle')
      topstacle.style.top = alt + 'px'
      topstacle.style.right = i + 'px'
      alt = alt === 0 ? 30 : 0
      maze.appendChild(topstacle)
    }

    overlay.appendChild(maze)
    overlay.appendChild(sidebar)
  }

  createMaze()
}
