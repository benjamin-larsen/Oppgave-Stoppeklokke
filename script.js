(() => {
    class ClockTimer {
        constructor() {
            /*
                timerRunning is set to true when the Timer is Runnning, this must be combined with a non-null timerStarted.
                timerRunning is set to false when the Timer is Reset or Paused.
            */
            this.timerRunning = false;
            /*
                timerStarted is set only when the Timer is Running
            */
            this.timerStarted = null;
            /*
                lastTime is set only when the Timer is paused
            */
            this.lastTime = null;
        }

        getTime() {
            if (this.timerRunning) {
                return Date.now() - this.timerStarted;
            } else {
                return this.lastTime || 0;
            }
        }

        start() {
            if (this.timerRunning) return;
            this.timerStarted = Date.now() - (this.lastTime || 0);
            this.lastTime = null;
            this.timerRunning = true;
        }

        pause() {
            if (!this.timerRunning) return;
            this.lastTime = Date.now() - this.timerStarted;
            this.timerStarted = null;
            this.timerRunning = false;
        }

        reset() {
            if (this.timerRunning || (timer.lastTime === null)) return;
            this.timerRunning = false;
            this.timerStarted = null;
            this.lastTime = null;
        }
    }

    const timer = new ClockTimer()
    window.timer = timer

    // First Child would be the Text Node of the Respective Elements, makes for faster rendering.
    const hourEl = document.getElementById("hour").firstChild;
    const minEl = document.getElementById("min").firstChild;
    const secEl = document.getElementById("sec").firstChild;
    const msEl = document.getElementById("ms").firstChild;

    const startBtn = document.getElementById("startBtn")
    const stopBtn = document.getElementById("stopBtn")
    const resetBtn = document.getElementById("resetBtn")

    window.startBtn = startBtn

    startBtn.addEventListener('click', (e) => {
        timer.start()
    })

    stopBtn.addEventListener('click', (e) => {
        timer.pause()
    })

    resetBtn.addEventListener('click', (e) => {
        timer.reset()
    })

    function render() {
        const time = BigInt(timer.getTime())
        const hours = time / 3600000n;
        const minutes = (time / 60000n) % 60n;
        const seconds = (time / 1000n) % 60n;
        const ms = time % 1000n;

        hourEl.nodeValue = hours.toString().padStart(2, "0");
        minEl.nodeValue = minutes.toString().padStart(2, "0");
        secEl.nodeValue = seconds.toString().padStart(2, "0");
        msEl.nodeValue = ms.toString().padStart(3, "0");

        // Only show Start Button when Timer is not Running
        startBtn.disabled = timer.timerRunning;

        // Only show Stop Button when Timer is Running
        stopBtn.disabled = !timer.timerRunning;

        // Only show Reset Button when Timer is not Running and is not set to zero already
        resetBtn.disabled = timer.timerRunning || (timer.lastTime === null);

        requestAnimationFrame(render)
    }

    requestAnimationFrame(render)
})();