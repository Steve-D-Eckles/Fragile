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
    arrow.addEventListener('click', () => console.log('hi'))
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
