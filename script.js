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
overlay.classList.add('overlay')

// create an instruction box
const instruct = document.createElement('p')
instruct.classList.add('instruct')

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
  if (collected.length < 4) {
    infoBox.textContent = `Looks like you've still got ${4 - collected.length} piece${4 - collected.length > 1 ? 's' : ''} to find.`
  } else {
    infoBox.textContent = 'Looks like you found all the pieces! Hit the button to assemble the start button.'
    // create button "Assemble"
    if (collected.length === 4) {
      if (!collected.includes('assemble')) collected.push('assemble')
      const assemble = document.createElement('button')
      assemble.classList.add('assemble')
      assemble.textContent = 'Assemble'
      assemble.addEventListener('click', () => {
        assemble.remove()
        start.style.visibility = ''
        infoBox.textContent = 'Alright! You can finally start the real game. Try to hit it gently this time!'
        collected.push('start')
        start.addEventListener('click', () => {
          main.remove()
          setTimeout(() => {
            alert('Oops everything broke, guess you\'ll just have to play this simple backup game ( ͡° ͜ʖ ͡°)')
            const link = document.getElementsByTagName('link')[0]
            link.setAttribute('href', 'snakestyles.css')
            snake()
          }, 100)
        })
      })
      main.appendChild(assemble)
    }
    if (collected.length === 5) {
      infoBox.textContent = 'Looks like you found all the pieces! Hit the button to assemble the start button.'
    }
    if (collected.length === 6) {
      infoBox.textContent = 'Alright! You can finally start the real game. Try to hit it gently this time!'
    }
  }
}

function travel (event) {
  if (!currentlyPlaying) {
    currentlyPlaying = true
    // create div
    // give it a class "overlay"
    main.appendChild(overlay)
    // determine the game being played
    const targetClasses = Array.from(event.target.classList)
    if (targetClasses.includes('forest')) {
      // call "forest" function
      forest()
      instruct.textContent = "We'll let you have your piece back if you win our " +
        "memory game! Click a tile to reveal it. Reveal two matching tiles and they'll " +
        "stay revealed; otherwise, they'll be hidden again. Reveal all tiles to win!"
    }
    if (targetClasses.includes('gambler')) {
      gambler()
      instruct.textContent = "You want your piece back? Let's play a game for it! " +
        "I'll roll two dice and show you the total. You guess if the total of my next " +
        'roll will be higher or lower. Guess correctly five times in a row and you win ' +
        "the piece. I win if you guess wrong, and that means we keep playing. I'm very lonely."
    }
    if (targetClasses.includes('vault')) {
      vault()
      instruct.textContent = 'Yeah, we found a piece and tossed it in the vault.' +
        "You're welcome to have it back, but they recently changed the locks and " +
        "We're not good at opening it. You have to slide the tiles around until it matches " +
        'the solution.'
    }
    if (targetClasses.includes('drain')) {
      drain()
      instruct.textContent = "Wow, that's a pretty convoluted drainage system. You'll " +
        'have to click the piece to select it, then carefully move your cursor through ' +
        'the pipes without touching the sides.'
    }
    main.appendChild(instruct)
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
  objective.textContent = collected.includes('forest') ? 'Piece already collected.' : 'Start Button Piece Available!'

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
    objective.textContent = collected.includes('forest') ? 'Piece already collected.' : 'Start Button Piece Available!'
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
                  if (!collected.includes('forest')) {
                    collected.push('forest')
                    objective.textContent = 'Button Piece\nRetrieved!'
                  } else {
                    objective.textContent = 'Button Piece\nAlready Retrieved!'
                  // otherwise, nothing about the game's overall state changes
                    // Text: "You already won this piece of the start button."
                  }
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
  instruct.remove()
  statusUpdate()
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
  button.innerHTML = 'Wanna play?'
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
  objective.textContent = collected.includes('gambler') ? 'Piece already collected.' : 'Start Button Piece Available!'
  sidebar.appendChild(objective)

  const restartButton = document.createElement('button')
  restartButton.classList.add('restart')
  restartButton.textContent = 'Restart'
  restartButton.addEventListener('click', () => {
    total = 0
    points = 0
    objective.textContent = collected.includes('gambler') ? 'Piece already collected.' : 'Start Button Piece Available!'
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
        gamblerSquare.classList.add('gambler-square' + n)
        // the following 2 lines insert random numbers into the squares
        gamblerSquare.textContent = Math.floor(Math.random() * 6) + 1
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
    gambleButtonLow.textContent = 'Guess lower'
    gambleButtonLow.addEventListener('click', checkGuess)

    const gambleButtonHigh = document.createElement('button')
    gambleButtonHigh.classList.add('gamble-high')
    gambleButtonHigh.textContent = 'Guess higher'
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
  function checkGuess (event) {
    const gamblerTotal = document.getElementsByClassName('gambler-total')[0]
    total = Number(gamblerTotal.textContent)
    const square0 = document.querySelector('.gambler-square0')
    const square1 = document.querySelector('.gambler-square1')
    square0.textContent = Math.floor(Math.random() * 6) + 1
    square1.textContent = Math.floor(Math.random() * 6) + 1
    const newTotal = Number(square0.textContent) + Number(square1.textContent)
    gamblerTotal.textContent = newTotal
    const gambleChoice = Array.from(event.target.classList)

    if (gambleChoice.includes('gamble-low')) {
      // if "newTotal" < "total", award a point
      if (newTotal < total) {
        points++
      }
      // if "newTotal" >= "total", set points to zero
      if (newTotal >= total) {
        points = 0
      }
      objective.textContent = 'You correctly guessed ' + points + ' out of 5 times in a row!'
    }
    if (gambleChoice.includes('gamble-high')) {
      // if "newTotal" < "total", set points to zero
      if (newTotal <= total) {
        points = 0
      }
      // if "newTotal" > "total", award a point
      if (newTotal > total) {
        points++
      }
      objective.textContent = 'You correctly guessed ' + points + ' out of 5 times in a row!'
    }
    if (points >= 5) {
      if (!collected.includes('gambler')) {
        collected.push('gambler')
        objective.textContent = 'You have won a piece of the start button!'
      } else {
        objective.textContent = 'You have already won this piece.'
      }
      // finish the win condition
    }
  }
}

function vault () {
  // define starting configuration
  const slideShuffle = () => {
    const start = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '']
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
  objective.textContent = collected.includes('vault') ? 'Piece already collected.' : 'Start Button Piece Available!'
  sidebar.appendChild(objective)

  const solution = document.createElement('button')
  const solved = document.createElement('div')
  solved.classList.add('solved')
  solution.classList.add('solution')
  solution.textContent = 'Solution'
  solution.addEventListener('mouseenter', () => {
    const sTable = document.createElement('table')
    let sRow = document.createElement('tr')
    for (let i = 1; i <= 16; i++) {
      const sData = document.createElement('td')
      sData.textContent = i
      sRow.appendChild(sData)
      if (i % 4 === 0) {
        sTable.appendChild(sRow)
        sRow = document.createElement('tr')
      }
    }
    solved.appendChild(sTable)
    main.appendChild(solved)
  })
  solution.addEventListener('mouseleave', () => {
    while (solved.firstChild) {
      solved.firstChild.remove()
    }
    solved.remove()
  })
  sidebar.appendChild(solution)

  const restartButton = document.createElement('button')
  restartButton.classList.add('restart')
  restartButton.textContent = 'Restart'
  restartButton.addEventListener('click', () => {
    objective.textContent = collected.includes('vault') ? 'Piece already collected.' : 'Start Button Piece Available!'
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
              if (!collected.includes('vault')) {
                collected.push('vault')
                objective.textContent = 'You\nWon!'
              } else {
                objective.textContent = 'You have already won.'
              }
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
    const cheat = event => {
      if (event.key === 'c') {
        x = 360
        y = 330
        piece.style.left = x + 'px'
        piece.style.bottom = y + 'px'
      }
    }
    window.addEventListener('keydown', cheat)
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

function snake () {
  let direction = 'right'
  let x = 0
  let y = 0
  let pickedUp = false
  let difficulty = 'Easy'
  let rate = 250
  let time
  let snake = [[x, y]]
  let fCoords
  do {
    fCoords = [Math.floor(Math.random() * 9) * 50, Math.floor(Math.random() * 9) * 50]
  } while (fCoords[0] === 0 && fCoords[1] === 0)
  console.log(fCoords)
  window.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight' && direction !== 'left') {
      direction = 'right'
    }
    if (event.key === 'ArrowDown' && direction !== 'up') {
      direction = 'down'
    }
    if (event.key === 'ArrowUp' && direction !== 'down') {
      direction = 'up'
    }
    if (event.key === 'ArrowLeft' && direction !== 'right') {
      direction = 'left'
    }
  })

  const main = document.createElement('main')
  document.body.appendChild(main)

  const died = document.createElement('p')
  died.classList.add('died')
  died.textContent = 'YOU DIED'

  const buttons = document.createElement('div')
  buttons.setAttribute('id', 'buttons')
  document.body.appendChild(buttons)

  const diffButton = document.createElement('button')
  diffButton.textContent = `Difficulty: ${difficulty}`
  diffButton.addEventListener('click', () => {
    if (difficulty === 'Easy') {
      difficulty = 'Medium'
      rate = 100
    } else if (difficulty === 'Medium') {
      difficulty = 'Hard'
      rate = 50
    } else {
      difficulty = 'Easy'
      rate = 250
    }
    diffButton.textContent = `Difficulty: ${difficulty}`
  })
  buttons.appendChild(diffButton)

  const startButton = document.createElement('button')
  startButton.textContent = 'START!'
  startButton.addEventListener('click', () => {
    while (buttons.firstChild) {
      buttons.firstChild.remove()
    }
    const restartButton = document.createElement('button')
    restartButton.textContent = 'Restart!'
    restartButton.addEventListener('click', () => {
      x = 0
      y = 0
      snake = [[x, y]]
      clearInterval(time)
      restartButton.remove()
      buttons.appendChild(diffButton)
      buttons.appendChild(startButton)
      direction = 'right'
      difficulty = 'Easy'
      diffButton.textContent = `Difficulty: ${difficulty}`
      rate = 250
      while (main.firstChild) {
        main.firstChild.remove()
      }
      do {
        fCoords = [Math.floor(Math.random() * 9) * 50, Math.floor(Math.random() * 9) * 50]
      } while (fCoords[0] === 0 && fCoords[1] === 0)
      died.remove()
    })
    buttons.appendChild(restartButton)
    time = setInterval(draw, rate)
  })
  buttons.appendChild(startButton)

  function draw () {
    while (main.firstChild) {
      main.firstChild.remove()
    }
    if (direction === 'right') {
      x = x + 50
      snake.unshift([x, y])
      if (!pickedUp) {
        snake.pop()
      }
      pickedUp = false
    }
    if (direction === 'left') {
      x = x - 50
      snake.unshift([x, y])
      if (!pickedUp) {
        snake.pop()
      }
      pickedUp = false
    }
    if (direction === 'down') {
      y = y + 50
      snake.unshift([x, y])
      if (!pickedUp) {
        snake.pop()
      }
      pickedUp = false
    }
    if (direction === 'up') {
      y = y - 50
      snake.unshift([x, y])
      if (!pickedUp) {
        snake.pop()
      }
      pickedUp = false
    }
    for (const piece of snake) {
      const div = document.createElement('div')
      div.style.left = piece[0] + 'px'
      div.style.top = piece[1] + 'px'
      main.appendChild(div)
    }
    if (snake[0][0] === fCoords[0] && snake[0][1] === fCoords[1]) {
      pickedUp = true
      do {
        fCoords = [Math.floor(Math.random() * 9) * 50, Math.floor(Math.random() * 9) * 50]
      } while (actuallyCompare(fCoords, snake))
    }
    const fruit = document.createElement('p')
    fruit.style.left = fCoords[0] + 'px'
    fruit.style.top = fCoords[1] + 'px'
    main.appendChild(fruit)
    if (actuallyCompare(snake[0], snake.slice(1))) {
      document.body.appendChild(died)
      clearInterval(time)
    }
    if (x >= 500 || x < 0 || y < 0 || y >= 500) {
      document.body.appendChild(died)
      clearInterval(time)
    }
  }

  function actuallyCompare (a, arr) {
    for (const elem of arr) {
      if (a[0] === elem[0] && a[1] === elem[1]) return true
    }
    return false
  }
}
