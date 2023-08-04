const alarmSound = new Audio();
const alarmSoundSrc = "./sound/duck.mp3";
let timerButtonFunction = "start";
let timerInterval;
let alarmQuackInterval;

function firstClick() {
  alarmSound.load();
  document.querySelector("body").removeEventListener("click", firstClick);
}

function changeDuckSize(imageSize) {
  var duckImage = document.getElementById("duck");
  var existingWidth = duckImage.style.width;
  setTimeout(() => {
    duckImage.style.width = imageSize;
  }, 300);
  setTimeout(() => {
    duckImage.style.width = existingWidth;
  }, 600);
}

function playSound() {
  alarmSound.src = alarmSoundSrc;
  alarmSound.currentTime = 0;
  alarmSound.play();
  changeDuckSize("260px");
}

function createCountdownDisplay(timeLeftInSeconds) {
  let seconds = timeLeftInSeconds % 60;
  let minutes = (timeLeftInSeconds - seconds) / 60;
  let secondsToDisplay = seconds < 10 ? "0" + seconds : seconds;
  let minutesToDisplay = minutes < 10 ? "0" + minutes : minutes;
  document.getElementById(
    "timerDisplay"
  ).textContent = `${minutesToDisplay}:${secondsToDisplay}`;
}

document.querySelector("body").addEventListener("click", firstClick);
document.querySelector("#startButton").addEventListener("click", controlTimer);

function alarmQuack(numberOfQuacks, intervalInMilliseconds, isEnding) {
  var i = 0;
  if (isEnding) {
    var controlButton = document.querySelector("#startButton");
    controlButton.textContent = "Stop Quacking";
  }
  playSound();
  i++;
  if (numberOfQuacks > 1) {
    alarmQuackInterval = setInterval(() => {
      playSound();
      if (i === numberOfQuacks - 1) {
        clearTimeout(alarmQuackInterval);
        if (isEnding) {
          restoreStartButton();
        }
      }
      i++;
    }, intervalInMilliseconds);
  }
}

function restoreStartButton() {
  timerButtonFunction = "start";
  var controlButton = document.querySelector("#startButton");
  controlButton.textContent = "Start Tooth Timer";
  controlButton.style.backgroundColor = "#156734";
  document.getElementById("timerDisplay").textContent = "02:00";
}

function stopTimer(cancelling) {
  clearTimeout(timerInterval);
  if (cancelling) {
    clearTimeout(alarmQuackInterval);
    restoreStartButton();
  }
}

function startTimer() {
  let minutes = 2;
  let seconds = minutes * 60;
  let remainingS = 120;
  let interval = 20;

  let startTime = new Date();

  createCountdownDisplay(seconds);

  timerInterval = setInterval(() => {
    let timeNow = new Date();
    let timeDifference = Math.floor((timeNow - startTime) / 1000);
    remainingS = seconds - timeDifference;

    createCountdownDisplay(remainingS);
    if (remainingS < 1) {
      stopTimer();
      alarmQuack(10, 1250, true);
    } else if (remainingS % interval === 0 && remainingS > 0) {
      alarmQuack(remainingS === 60 ? 2 : 1, 1000);
    }
  }, 1000);

  timerButtonFunction = "cancel";
  var controlButton = document.querySelector("#startButton");
  controlButton.textContent = "Cancel Tooth Timer";
  controlButton.style.backgroundColor = "#e81123";
}

function controlTimer() {
  if (timerButtonFunction === "start") {
    startTimer();
  } else if (timerButtonFunction === "cancel") {
    stopTimer(true);
  }
}
