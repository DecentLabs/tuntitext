const STATE = {
  STOP: 'stop',
  PLAY: 'play'
}

export default class Vtt {
  constructor (cueList) {
    this.cues = []
    for (let cue of cueList) {
      this.cues.push(cue)
      console.log(cue.startTime, cue.endTime)
    }
    this.state = STATE.STOP
    this.activeCue = undefined
    this.activeIndex = -1
    this.startTimestamp = 0
  }

  getActiveCueIndex (dtSec, start) {
    let nextCue = this.cues[start + 1]
    if (nextCue && nextCue.startTime <= dtSec) {
      return start + 1
    }
    return start
  }

  playFrame () {
    const now = Date.now()
    const dt = (now - this.startTimestamp) / 1000
    if (this.activeIndex < this.cues.length-1) {
      this.activeIndex = this.getActiveCueIndex(dt, this.activeIndex)
      const newActiveCue = this.cues[this.activeIndex]
      if (newActiveCue !== this.activeCue) {
        console.log('newCue', newActiveCue)
        this.activeCue = newActiveCue
        if (this.oncuechange) {
          this.oncuechange(this.activeCue)
        }
      }
    } else {
      this.state = STATE.STOP
    }
  }

  play () {
    requestAnimationFrame(() => {
      this.playFrame()
      if (this.state === STATE.PLAY) {
        this.play()
      }
    })
  }

  start () {
    this.state = STATE.PLAY
    this.startTimestamp = Date.now()
    this.play()
  }

}
