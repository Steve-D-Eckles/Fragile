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

function travel (event) {
  //create div
  const overlay = document.createElement("div");
  //give it a class "overlay"
  overlay.classList.add("overlay");
  main.appendChild(overlay);
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex, board;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;

  }
  // modify this to place each random number into a table cell.


  return array;
}

// Used like so
let array = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
array = shuffle(array);
console.log(array);
// Add event listeners for the table cells
