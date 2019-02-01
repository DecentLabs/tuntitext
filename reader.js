import Vtt from './vtt.js'

const video = document.querySelector('video')
const textWrapper = document.querySelector('#text')
const track = document.querySelector('video > track').track
const start = document.querySelector('button')

let playing = false
let vtt = null

const getId = cue => `cue-${cue.startTime}-${cue.endTime}`

const text = []


for (let cue of track.cues) {
  const p = document.createElement('p')
  p.innerHTML = cue.text
  p.id = getId(cue)
  text.push(p)
}

start.removeAttribute('disabled')

text.forEach(p => {
  textWrapper.appendChild(p)
})

vtt = new Vtt(track.cues)
vtt.oncuechange = function (cue) {
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

start.addEventListener('click', e => {
  if (!playing) {
    playing = true
    vtt.start()
    document.body.classList.remove('start')
  }
})

