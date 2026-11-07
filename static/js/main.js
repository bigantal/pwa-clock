'use strict';

const TRANSITION_MS = 240;

const clockEl = document.querySelector('.clock');
let shownTime = clockEl.textContent;
let wakeLock = null;

function formatTime(date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function updateClock() {
    const time = formatTime(new Date());
    if (time === shownTime) {
        return;
    }
    shownTime = time;

    // The digits swap halfway through the animated fill, so it hides the change.
    clockEl.classList.add('anim');
    setTimeout(() => {
        clockEl.textContent = time;
    }, TRANSITION_MS / 2);
    setTimeout(() => {
        clockEl.classList.remove('anim');
    }, TRANSITION_MS);
}

// Tick on the second boundary, so the minute changes on time rather than up to
// a second late, and a changed system clock is picked up straight away.
function tick() {
    updateClock();
    setTimeout(tick, 1000 - (Date.now() % 1000));
}

// Keep the screen on while the clock is showing. Unsupported browsers, and
// requests the browser refuses, just leave the normal screen timeout in place.
async function keepScreenOn() {
    if (!('wakeLock' in navigator) || (wakeLock && !wakeLock.released)) {
        return;
    }
    try {
        wakeLock = await navigator.wakeLock.request('screen');
    } catch {
        wakeLock = null;
    }
}

// Timers are throttled in the background and the wake lock is dropped there.
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        updateClock();
        keepScreenOn();
    }
});

// Some browsers only grant the wake lock after a user gesture.
document.addEventListener('pointerup', keepScreenOn);

tick();
keepScreenOn();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}
