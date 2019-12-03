const gameStart = () => {
  for (let i = 0; i < 4; i++) {
    const arrow = document.createElement('div')
    arrow.classList.add('arrow')
    if (i < 2) {
      arrow.style.top = 320 + i * 110 + 'px'
      arrow.style.left = 100 + 'px'
    } else {
      arrow.style.top = 100 + i * 110 + 'px'
      arrow.style.left = 800 + 'px'
    }
    document.body.getElementsByTagName('main')[0].appendChild(arrow)
  }
  start.remove()
  const placeHolder = document.createElement('div')
  placeHolder.classList.add('start')
  main.appendChild(placeHolder)
}

const start = document.getElementById('start')
const main = document.body.children[0]
start.addEventListener('click', gameStart)
