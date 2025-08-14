(() => {
    class ClockTimer {
        constructor(render) {
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

            // .bind will force a context to a Function because requsetAnimationFrame does not copy the context on its own.
            this.renderFn = render.bind(this);
            this.renderId = null;
        }

        stopRender() {
            if (this.renderId) {
                cancelAnimationFrame(this.renderId);
                this.renderId = null;
            }
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

            this.renderFn()
        }

        pause() {
            if (!this.timerRunning) return;
            this.lastTime = Date.now() - this.timerStarted;
            this.timerStarted = null;
            this.timerRunning = false;

            this.stopRender()
        }

        reset() {
            if (this.timerRunning || (timer.lastTime === null)) return;
            this.timerRunning = false;
            this.timerStarted = null;
            this.lastTime = null;

            this.renderFn(null, true)
        }
    }

    // First Child would be the Text Node of the Respective Elements, makes for faster rendering.
    const hourEl = document.getElementById("hour").firstChild;
    const minEl = document.getElementById("min").firstChild;
    const secEl = document.getElementById("sec").firstChild;
    const msEl = document.getElementById("ms").firstChild;

    const startBtn = document.getElementById("startBtn")
    const stopBtn = document.getElementById("stopBtn")
    const resetBtn = document.getElementById("resetBtn")

    window.startBtn = startBtn

    function updateButtonState() {
        // Only show Start Button when Timer is not Running
        startBtn.disabled = timer.timerRunning;

        // Only show Stop Button when Timer is Running
        stopBtn.disabled = !timer.timerRunning;

        // Only show Reset Button when Timer is not Running and is not set to zero already
        resetBtn.disabled = timer.timerRunning || (timer.lastTime === null);
    }

    function updateElement(el, value) {
        const formatted = value.toString().padStart(2, "0");
        if (el.nodeValue === formatted) return;
        el.nodeValue = formatted;
    }

    /* First Paramter is reserved by requestAnimationFrame, and will not be used by this Program. */
    function render(_, once = false) {
        if (!this.timerRunning && !once) return;

        const time = BigInt(this.getTime())
        const hours = time / 3600000n;
        const minutes = (time / 60000n) % 60n;
        const seconds = (time / 1000n) % 60n;
        const ms = time % 1000n;

        updateElement(hourEl, hours);
        updateElement(minEl, minutes);
        updateElement(secEl, seconds);
        updateElement(msEl, ms);

        if (!once) {
            this.renderId = requestAnimationFrame(this.renderFn)
        }
    }

    const timer = new ClockTimer(render)
    
    startBtn.addEventListener('click', (e) => {
        timer.start()
        updateButtonState()
    })

    stopBtn.addEventListener('click', (e) => {
        timer.pause()
        updateButtonState()
    })

    resetBtn.addEventListener('click', (e) => {
        timer.reset()
        updateButtonState()
    })

})();