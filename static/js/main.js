window.onload = () => {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('./sw.js');
    }


    updateTime();
    setInterval(() => {
        updateTime();
    }, 1000);

}

let timeStr = "     ";

function updateTime() {
    const timeStr2 = getTimeStr();
    if (timeStr !== timeStr2) {
        timeStr = timeStr2;
        const clockEl = document.getElementsByClassName("clock")[0];
        clockEl.innerHTML = timeStr;
        addAnim(clockEl);
    }
}

function getTimeStr() {
    const time = new Date();
    const hour = time.getHours() < 10 ? "0" + time.getHours() : time.getHours();
    const minute = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return `${hour}:${minute}`;
}

function addAnim(elem) {
    elem.classList.add("anim");
    setTimeout(() => {
        elem.classList.remove("anim");
    }, 150);

}