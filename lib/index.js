/*
 * @path        : \yv-polling\lib\index.js
 * @message     : 
 * @Author      : yvangod
 */
const timerArr = [];
class Poll {
  constructor(options) {
    this.options = Object.assign({
      type: "step",
      interval: 1000,
      action: null,
      count: Infinity,
    }, options);
    this.init();
    return this;
  }

  init() {
    this.timer = null;
    this._count = 0;
    this.pause = false;
    this.surplustime = 0;
  }

  stop() {
    this.pause = true;
    if (!this.timer) return;
    clearTimeout(this.timer);
  }

  beforeNext() {
    if (this._count >= this.options.count) {
      return this.stop()
    } else {
      return this.createtimer()
    }
  }

  looper() {
    let action = this.options.action();

    if (isPromise(action)) {
      action.then(() => {
        this._count++;
        return this.beforeNext.call(this, () => Promise.resolve(arguments))
      })
    } else {
      this._count++;
      return this.beforeNext.call(this)
    }
  }

  createtimer(surplustime) {
    if (this.pause) return;
    if(!surplustime){
      this.surplustime = new Date().getTime();
    }
    if(this.timer){
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(
      this.looper.bind(this),
      surplustime || this.options.interval
    )
  }

  run() {
    this.pause = false;
    this.createtimer();
    return this;
  }

  goon() {
    this.pause = false;
    let _surplustime = new Date().getTime() - this.surplustime;
    if(_surplustime >= this.options.interval) {
      this.looper.call(this);
    }else{
      this.createtimer(this.options.interval - _surplustime);
    }
  }
}

export default {
  start(options) {
    let poll = new Poll(options)
    timerArr.push(poll);
    return poll;
  },
  stop(poll) {
    if (!poll) return;
    poll.stop.call(poll)
  },
  clear() {
    timerArr.forEach(i => i.stop.call(i))
  }
};

function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}