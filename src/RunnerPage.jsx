import { useState, useEffect } from 'preact/hooks'

// All this is just do fully disable scrolling when running
// modern Chrome requires { passive: false } when adding event
let supportsPassive = false;
try {
  window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
    get: function () { supportsPassive = true; }
  }));
} catch(e) {}

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

const preventDefault = e => e.preventDefault()

function disableScroll() {
  window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
  window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
  window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
}

function enableScroll() {
  window.removeEventListener('DOMMouseScroll', preventDefault, false);
  window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
  window.removeEventListener('touchmove', preventDefault, wheelOpt);
}


var blinkTimer
var speakTimer

export default function RunnerPage({names, blinkInterval, speakInterval, running, setRunning}) {
    const [current, setCurrent] = useState(0);

    function blink() {
        const cur = document.body.style.backgroundColor;
        document.body.style.backgroundColor = 'red';
        setTimeout(() => {
            document.body.style.backgroundColor = cur;
        }, 200);
    }

    function increment() {
        setCurrent((current + 1) % names.length);
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            // This could probably be optimized
            const utter = new SpeechSynthesisUtterance(text);
            speechSynthesis.cancel(); // stop previous
            speechSynthesis.speak(utter);
        }
    }

    // Whenever we first enter into RunningPage: initialize the voices
    useEffect(() => {
        if ('speechSynthesis' in window) {
            speechSynthesis.getVoices();
        }
    }, []);

    // Whenever we enter or exit RunningPage, or the current name changes
    useEffect(() => {
        if (running) {
            if (blinkInterval) blinkTimer = window.setInterval(blink, blinkInterval * 1000);
            if (speakInterval) speakTimer = window.setInterval(() => speak(names[current]), speakInterval * 1000);

            window.onclick = increment;
            window.oncontextmenu = e => {
                e.preventDefault();
                setRunning(false);
            };
            document.documentElement.requestFullscreen();
            disableScroll();

            return () => {
                window.oncontextmenu = null;
                if (blinkInterval) window.clearInterval(blinkTimer);
                if (speakInterval) window.clearInterval(speakTimer);
                try { document.exitFullscreen(); } catch (e) {}
                enableScroll();
            };
        }
        else {
            window.oncontextmenu = null;
            if (blinkInterval) window.clearInterval(blinkTimer);
            if (speakInterval) window.clearInterval(speakTimer);
            try { document.exitFullscreen(); } catch (e) {}
            enableScroll();
        }
    }, [running, blinkInterval, speakInterval]);

    // Whenever the current name changes: speak it, and reset the timers, and set click to go to the next one
    useEffect(() => {
        window.onclick = e => setCurrent((current + 1) % names.length)

        speak(names[current]);
        // Reset blink timer
        if (blinkInterval) {
            if (blinkTimer) window.clearInterval(blinkTimer);
            blinkTimer = window.setInterval(blink, blinkInterval * 1000)
        }
        // Reset speak timer
        if (speakInterval) {
            if (speakTimer) window.clearInterval(speakTimer);
            speakTimer = window.setInterval(() => speak(names[current]), speakInterval * 1000);
        }

        return () => {
            window.onclick = null;
            if (blinkInterval) window.clearInterval(blinkTimer);
            if (speakInterval) window.clearInterval(speakTimer);
        }
    }, [current]);

    return <div id="runner">
        <div style={{transform: `rotate(180deg)`}}>{names[current]}</div>
        <div>{names[current]}</div>
    </div>
}