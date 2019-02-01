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
    this.activeCue = null
    this.activeIndex = 0
    this.startTimestamp = 0
    this.lastTime = this.cues[this.cues.length-1].endTime
  }

  getActiveCue (dtSec) {
    let currentCue = this.cues[this.activeIndex]
    for (let i = this.activeIndex; (currentCue.startTime <= dtSec)  && i < this.cues.length; i++) {
      currentCue = this.cues[i]
//      console.log(currentCue.startTime, dtSec, currentCue.endTime)
      if (currentCue.startTime <= dtSec && currentCue.endTime >= dtSec) {
        this.activeIndex = i;
        return currentCue
      }
    }
  }

  playFrame () {
    const now = Date.now()
    const dt = (now - this.startTimestamp)/1000
//    console.log('indexes: ',this.activeIndex, this.cues.length, dt , this.lastTime)
    if (this.activeIndex < this.cues.length && dt <= this.lastTime) {
      const newActiveCue = this.getActiveCue(dt)
      if (newActiveCue !== this.activeCue) {
        console.log('newCue', newActiveCue) // emitEventWithNewActiveCue
        this.activeCue = newActiveCue
        if(this.oncuechange) {
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
