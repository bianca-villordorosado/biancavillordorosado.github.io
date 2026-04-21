let volume = 0;
let eventTimer = "";
let timeLeft = 0;

let currentSentence = "";
let currentProblem = "";
let correctAnswer = "";
let userColors = [];
let correctColors = [];
let currentEventType = "";

const sentences = [
    "Peter Piper picked a peck of pickled peppers.",
    "Betty Botter bought some butter",
    "She sells seashells by the seashore.",
    "Near an ear, a nearer ear, a nearly eerie ear.",
    "Four fine fresh fish for you."
] 

const operations = ["+", "-", "*"]

const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

document.getElementById("startButton").addEventListener("click", startEvent);
document.getElementById("submitButton").addEventListener("click", checkEvent);
document.getElementById("endButton").addEventListener("click", endEvent);

function updateVolume() {
    document.getElementById("volumeDisplay").textContent = "Current Volume: " + volume;
}

function startTimer(duration) {
    clearInterval(eventTimer);

    timeLeft = Math.floor(duration / 1000);
    updateTimerDisplay();

    eventTimer = setInterval(() => {
        timeLeft = timeLeft - 1;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(eventTimer);
            volume = volume - 1;
            updateVolume();

            document.getElementById("eventPrompt").textContent = "Time's up!";
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("timerDisplay").textContent = "Time: " + timeLeft;
}

function stopTimer() {
    clearInterval(eventTimer);
}

function typingEvent() {
    clearColorChoices();
    currentEventType = "typing";

    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];

    document.getElementById("eventPrompt").textContent = "Type: " + currentSentence;
    document.getElementById("submitButton").style.display = "inline-block";
    document.getElementById("userInput").style.display = "inline-block";
    document.getElementById("userInput").value = "";
    document.getElementById("timerDisplay").style.display = "inline-block";

    startTimer(10000);
}

function mathEvent() {
    clearColorChoices();
    currentEventType = "math";

    const randomProblem = operations[Math.floor(Math.random() * operations.length)];

    const num1 = Math.floor(Math.random() * 50) + 1;
    const num2 = Math.floor(Math.random() * 50) + 1;

    if (randomProblem == "+") {
        correctAnswer = num1 + num2;
        currentProblem = num1 + " + " + num2;
    } else if (randomProblem == "-") {
        correctAnswer = num1 - num2;
        currentProblem = num1 + " - " + num2;
    } else if (randomProblem == "*") {
        num1 = Math.floor(Math.random() * 11) + 1;
        num2 = Math.floor(Math.random() * 11) + 1;
        correctAnswer = num1 * num2;
        currentProblem = num1 + " * " + num2;
    }

    document.getElementById("eventPrompt").textContent = "Solve: " + currentProblem;
    document.getElementById("submitButton").style.display = 
    "inline-block";
    document.getElementById("userInput").style.display = "inline-block";
    document.getElementById("timerDisplay").style.display = "inline-block";
    document.getElementById("userInput").value = "";

    startTimer(10000);
}

function renderColorChoices() {
    const colorContainer = document.getElementById("colorChoices");
    colorContainer.innerHTML = "";

    colors.forEach(color => {
        const box = document.createElement("div");
        box.classList.add("choiceColor");
        box.style.backgroundColor = color;

        box.addEventListener("click", () => {
            userColors.push(color);

            if (userColors.length === correctColors.length) {
                checkEvent();
            }
        });

        colorContainer.appendChild(box);
    })
}

function clearColorChoices() {
    document.getElementById("colorDisplay").innerHTML = "";
    document.getElementById("colorChoices").innerHTML = "";

    correctColors = [];
    userColors = [];
}

function colorEvent() {
    stopTimer();
    currentEventType = "color";

    const display = document.getElementById("colorDisplay");
    display.innerHTML = "";
    correctColors = [];
    userColors = [];

    const colorSequenceLength = Math.floor(Math.random() * 3) + 3;

    for (let i=0; i < colorSequenceLength; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        correctColors.push(randomColor);

        const square = document.createElement("div");
        square.classList.add("squareColor");
        square.style.backgroundColor = randomColor;
        display.appendChild(square);
    }

    document.getElementById("submitButton").style.display = "none";
    document.getElementById("userInput").style.display = "none";
    document.getElementById("timerDisplay").style.display = "none";
    document.getElementById("eventPrompt").textContent = "Remember this color sequence: ";

    setTimeout(() => {
        display.innerHTML = "";
        document.getElementById("eventPrompt").textContent = "Enter the color sequence";

        renderColorChoices();
    }, 2000);

    document.getElementById("userInput").value = "";
}


function startEvent() {
    const eventType = Math.floor(Math.random() * 3);
    
    if (eventType == 0) {
        typingEvent();
    } else if (eventType == 1) {
        mathEvent();
    } else if (eventType == 2) {
        colorEvent();
    }
}

function checkEvent() {
    stopTimer();

    const userInput = document.getElementById("userInput").value;
    let isCorrect = false;

    if (currentEventType == "typing") {
        isCorrect = (userInput === currentSentence);
    } else if (currentEventType == "math") {
        isCorrect = (parseInt(userInput) == correctAnswer);
    } else if (currentEventType == "color") {
        isCorrect = JSON.stringify(userColors) === JSON.stringify(correctColors);
    }

    if (isCorrect) {
        volume = volume + 10;
    } else {
        volume = volume - 1;
    }

    updateVolume();
    document.getElementById("userInput").value = "";
}

function endEvent() {
    stopTimer();
    currentEventType = "";

    document.getElementById("eventPrompt").textContent = "";
    document.getElementById("userInput").value = "";

    clearColorChoices();

    document.getElementById("submitButton").style.display = 
    "inline-block";
    document.getElementById("userInput").style.display = "inline-block";
    document.getElementById("timerDisplay").style.display = "inline-block";

    timeLeft = 0;
    updateTimerDisplay();
}