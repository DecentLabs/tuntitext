import Vtt from './vtt.js'

const textWrapper = document.querySelector('#text')
const trackElement = document.querySelector('video > track')
const start = document.querySelector('button')

const getId = cue => `cue-${cue.startTime}-${cue.endTime}`

const text = []

const trackLoaded = (trackElement.track.cues && trackElement.track.cues.length) ? Promise.resolve(trackElement.track) : new Promise(resolve => {
  trackElement.addEventListener('load', () => {
    resolve(trackElement.track)
  })
})

trackLoaded.then(track => {
  start.removeAttribute('disabled')

  for (let cue of track.cues) {
    const p = document.createElement('p')
    p.innerHTML = cue.text
    p.id = getId(cue)
    text.push(p)
    textWrapper.appendChild(p)
  }

  const vtt = new Vtt(track.cues)
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
    vtt.start()
    document.body.classList.remove('start')
  })
})

