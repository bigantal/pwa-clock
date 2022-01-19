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

let timeStr = "";
function updateTime() {
  const time = new Date();
  const timeStr2 = `${time.getHours()}:${time.getMinutes()}`;
  if (timeStr !== timeStr2) {
    timeStr = timeStr2;
    const clockEl=document.getElementsByClassName("clock")[0];
    clockEl.innerHTML = timeStr;
  }
}
