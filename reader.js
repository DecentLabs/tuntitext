const video = document.querySelector('video')
const textWrapper = document.querySelector('#text')
const track = document.querySelector('video > track')
const start = document.querySelector('button')
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

let playing = false

const getId = cue => `cue-${cue.startTime}-${cue.endTime}`

const text = []

const tracksLoaded = new Promise(resolve => {
  track.addEventListener('load', e => {
    const track = e.target.track

    track.oncuechange = function () {
      let cue = this.activeCues[0]
      if (cue) {
        let actual = null
        const currentId = getId(cue)
        text.forEach(p => {
          p.classList.remove('actual')
          if (p.id === currentId) {
            p.classList.add('actual')
            actual = p
          }
        })

        if (actual) {
          actual.scrollIntoViewIfNeeded(true)
        }
      }
    }

    for (let cue of track.cues) {
      const p = document.createElement('p')
      p.innerHTML = cue.text
      p.id = getId(cue)
      text.push(p)
    }

    start.removeAttribute('disabled')

    resolve(track)
  })
})

tracksLoaded.then(track => {
  text.forEach(p => {
    textWrapper.appendChild(p)
  })
})


start.addEventListener('click', e => {
  if (!playing) {
    playing = true
    video.srcObject = canvas.captureStream(24)
    video.play()
    document.body.classList.remove('start')
  }
})

function draw () {
  requestAnimationFrame(() => {
    const r = Math.floor(Math.random() * 255)
    const g = Math.floor(Math.random() * 255)
    const b = Math.floor(Math.random() * 255)
    const x = Math.random() * 160
    const y = Math.random() * 120
    ctx.fillStyle = `rgba(${r},${g},${b})`
    ctx.fillRect(x, y, 10, 10)
    draw()
  })
}

draw()
