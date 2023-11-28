let minutes = 2;
const alarmSound = new Audio();
const alarmSoundSrc = "./sound/duck.mp3";
let timerButtonFunction = "start";
let timerInterval;
let circleTimerInterval;
let alarmQuackInterval;
let svgDimension = 280;
let interval = 20;
let timerColour = "#C75F2E";

document.getElementById("timerSVG").setAttribute("width", svgDimension);
document.getElementById("timerSVG").setAttribute("height", svgDimension);
document.querySelector(".settings").addEventListener("click", settingsDisplay);
document.getElementById("settingsForm").onclick = function () {
  minutes = document.querySelector('input[name="timeChoice"]:checked').value;
  timerColour = document.querySelector(
    'input[name="colourChoice"]:checked'
  ).value;
  document.getElementById("path").setAttribute("stroke", timerColour);
  createCountdownDisplay(minutes * 60);
};
document.querySelector(".closeButton").addEventListener("click", function (e) {
  e.preventDefault();
  if (
    window.getComputedStyle(document.querySelector(".formContainer"))
      .display !== "none"
  ) {
    document.querySelector(".formContainer").style.display = "none";
  }
});

if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  document.getElementById("timerTrack").setAttribute("stroke", "#111122");
} else {
  document.getElementById("timerTrack").setAttribute("stroke", "#EEEEFF");
}

var slider = document.getElementById("quackInterval");
var sliderDisplay = document.querySelector(".sliderValue");
sliderDisplay.textContent = `${slider.value} seconds`;
slider.oninput = function () {
  let valueToDisplay = slider.value;
  if (valueToDisplay === "40") {
    valueToDisplay = "30";
    slider.value = "30";
  }

  if (valueToDisplay === "50") {
    valueToDisplay = "60";
    slider.value = "60";
  }

  sliderDisplay.textContent = `${valueToDisplay} seconds`;
  interval = slider.value;
};

function turnSvg(angle) {
  const angleAsRadians = angle * (Math.PI / 180);
  const radius = svgDimension / 2 - 4;
  const startX = svgDimension / 2 + radius;
  const startY = svgDimension / 2;

  const half2startX = svgDimension - startX;
  const half2startY = svgDimension / 2;

  const newXCoordinate = svgDimension / 2 + radius * Math.cos(angleAsRadians);
  const newYCoordinate = svgDimension / 2 + radius * Math.sin(angleAsRadians);

  let path;

  if (newYCoordinate >= svgDimension / 2) {
    path = `M ${newXCoordinate} ${newYCoordinate}
    A ${radius} ${radius} 0 0 1 ${half2startX} ${half2startY}
    L ${half2startX} ${half2startY}
    A ${radius} ${radius} 0 0 1 ${startX} ${startY}
    L ${startX} ${startY}`;
  } else {
    path = `M ${newXCoordinate} ${newYCoordinate}
    A ${radius} ${radius} 0 0 1 ${startX} ${startY}
    L ${startX} ${startY}`;
  }

  document.getElementById("path").setAttribute("d", path);
}

createCountdownDisplay(minutes * 60);
turnSvg(0);

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
    controlButton.style.backgroundColor = "#155DAD";
    controlButton.style.borderColor = "#7494b8";
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
  controlButton.style.borderColor = "#638A73";
  createCountdownDisplay(minutes * 60);
  turnSvg(0);
  const settingsBlock = document.querySelector(".settings");

  settingsBlock.addEventListener("click", settingsDisplay);
  settingsBlock.removeAttribute("disabled", "");
}

function stopTimer(cancelling) {
  clearTimeout(timerInterval);
  clearTimeout(circleTimerInterval);

  if (cancelling) {
    clearTimeout(alarmQuackInterval);
    restoreStartButton();
  } else {
    turnSvg(360);
  }
}

function startTimer() {
  // close settings if open
  if (
    window.getComputedStyle(document.querySelector(".formContainer"))
      .display !== "none"
  ) {
    document.querySelector(".formContainer").style.display = "none";
  }

  // cancel the event listener for settings
  const settingsBlock = document.querySelector(".settings");
  settingsBlock.removeEventListener("click", settingsDisplay);
  settingsBlock.setAttribute("disabled", "");

  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    document.getElementById("timerTrack").setAttribute("stroke", "#111122");
  } else {
    document.getElementById("timerTrack").setAttribute("stroke", "#EEEEFF");
  }

  let seconds = minutes * 60;
  let remainingS = 120;

  let startTime = new Date();

  createCountdownDisplay(seconds);

  // run digital display and quacking
  timerInterval = setInterval(() => {
    let timeNow = new Date();
    let timeDifference = Math.floor((timeNow - startTime) / 1000);
    remainingS = seconds - timeDifference;

    createCountdownDisplay(remainingS);
    if (remainingS < 1) {
      stopTimer();
      alarmQuack(10, 1250, true);
    } else if (remainingS % interval === 0 && remainingS > 0) {
      alarmQuack(remainingS === seconds / 2 ? 2 : 1, 1000);
    }
  }, 1000);

  // run smooth countdown circle display
  circleTimerInterval = setInterval(() => {
    let timeNow = new Date();
    let timeDifferenceMilliseconds = Math.floor(timeNow - startTime);
    let milliseconds = seconds * 1000;
    let remainingMilliseconds = milliseconds - timeDifferenceMilliseconds;

    if (remainingMilliseconds >= 0) {
      let angle = 360 - (360 / milliseconds) * remainingMilliseconds;
      turnSvg(angle);
    }
  }, 25);

  timerButtonFunction = "cancel";
  var controlButton = document.querySelector("#startButton");
  controlButton.textContent = "Cancel Tooth Timer";
  controlButton.style.backgroundColor = "#e81123";
  controlButton.style.borderColor = "#b77f84";
}

function controlTimer() {
  if (timerButtonFunction === "start") {
    startTimer();
  } else if (timerButtonFunction === "cancel") {
    stopTimer(true);
  }
}

function settingsDisplay() {
  if (
    window.getComputedStyle(document.querySelector(".formContainer"))
      .display === "none"
  ) {
    document.querySelector(".formContainer").style.display = "block";
  } else {
    document.querySelector(".formContainer").style.display = "none";
  }
}
