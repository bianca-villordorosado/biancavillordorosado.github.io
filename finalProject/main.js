let volume = 0;
let eventTimer = "";
let timeLeft = 0;
let nextEventTimer = null;

let currentSentence = "";
let currentProblem = "";
let correctAnswer = "";
let userColors = [];
let correctColors = [];
let currentEventType = "";

const eventTime = 30000;

const sentences = [
    "Peter Piper picked a peck of pickled peppers",
    "Betty Botter bought some butter",
    "She sells seashells by the seashore",
    "Near an ear, a nearer ear, a nearly eerie ear",
    "Four fine fresh fish for you",
    "Silly sheep weep and sleep",
    "Busy buzzing bumble bees",
    "Sick thick thistle sticks"
] 

const operations = ["+", "-", "*"]

const colors = ["red", "orange", "yellow", "green", "blue", "purple"];

document.getElementById("startButton").addEventListener("click", startEvent);
document.getElementById("submitButton").addEventListener("click", checkEvent);
document.getElementById("endButton").addEventListener("click", endEvent);
document.getElementById("undoColorButton").addEventListener("click", undoColor);
document.getElementById("finalizeButton").addEventListener("click", finalizeVolume)

function updateVolume() {
    document.getElementById("volumeDisplay").textContent = "Current Volume: " + volume;
}

function addVolume(amount) {
    volume = Math.max(0, Math.min(100, volume + amount));
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
            addVolume(-1);
            updateVolume();

            document.getElementById("eventPrompt").textContent = "Time's up! -1 volume";

            setTimeout(() => {
                startNextEventCountdown();
            }, 1500);
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById("timerDisplay").textContent = "Time: " + timeLeft;
}

function stopTimer() {
    clearInterval(eventTimer);
}

function resetAllTimers() {
    clearInterval(eventTimer);
    eventTimer = null;

    clearInterval(nextEventTimer);
    nextEventTimer = null;
}

function typingEvent() {
    clearColorChoices();
    currentEventType = "typing";

    const randomIndex = Math.floor(Math.random() * sentences.length);
    currentSentence = sentences[randomIndex];

    document.getElementById("eventPrompt").textContent = "Type this sentence: " + currentSentence;
    document.getElementById("submitButton").style.display = "inline-block";
    document.getElementById("userInput").style.display = "inline-block";
    document.getElementById("userInput").value = "";
    document.getElementById("timerDisplay").style.display = "inline-block";

    startTimer(eventTime);
}

function mathEvent() {
    clearColorChoices();
    currentEventType = "math";

    const randomProblem = operations[Math.floor(Math.random() * operations.length)];

    let num1 = Math.floor(Math.random() * 50) + 1;
    let num2 = Math.floor(Math.random() * 50) + 1;

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

    startTimer(eventTime);
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
            renderSelectedColors();
        });

        colorContainer.appendChild(box);
    })
}

function renderSelectedColors() {
    const selectedColorsBoxes = document.getElementById("selectedColors");
    selectedColorsBoxes.innerHTML = "";

    userColors.forEach(color => {
        const box = document.createElement("div");

        box.classList.add("selectedColorBox");
        box.style.backgroundColor = color;

        selectedColorsBoxes.appendChild(box);
    });
}

function undoColor() {
    userColors.pop();
    renderSelectedColors();
}

function clearColorChoices() {
    document.getElementById("colorDisplay").innerHTML = "";
    document.getElementById("colorChoices").innerHTML = "";
    document.getElementById("selectedColors").innerHTML = "";
    document.getElementById("undoColorButton").style.display = "none";

    correctColors = [];
    userColors = [];
}

function colorEvent() {
    stopTimer();
    currentEventType = "color";

    const display = document.getElementById("colorDisplay");
    display.innerHTML = "";
    document.getElementById("selectedColors").innerHTML = "";
    document.getElementById("colorChoices").innerHTML = "";
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
        document.getElementById("submitButton").style.display = "inline-block";
        document.getElementById("undoColorButton").style.display = "inline-block";

        renderColorChoices();
    }, 2000);

    document.getElementById("userInput").value = "";
}


function startEvent() {
    resetAllTimers();
    if (currentEventType === "ended" || currentEventType === "finalized") {
        currentEventType = "";
    }

    if (currentEventType === "ended" || currentEventType === "finalized") {
        return;
    }

    document.getElementById("submitButton").style.display = "none";
    document.getElementById("userInput").style.display = "none";

    const eventType = Math.floor(Math.random() * 3);
    
    if (eventType == 0) {
        typingEvent();
    } else if (eventType == 1) {
        mathEvent();
    } else if (eventType == 2) {
        colorEvent();
    }
}

function startNextEventCountdown() {
    resetAllTimers();

    let countdown = 5;

    document.getElementById("eventPrompt").textContent = "Next event in " + countdown + "...";

    nextEventTimer = setInterval(() => {
        countdown = countdown - 1;
        document.getElementById("eventPrompt").textContent = "Next event in " + countdown + "...";

        if (countdown <= 0) {
            clearInterval(nextEventTimer);
            nextEventTimer = null;
            startEvent();
        }
    }, 1000);
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
        addVolume(10);
        document.getElementById("eventPrompt").textContent = "Success! +10 volume";
    } else {
        addVolume(-1);
        document.getElementById("eventPrompt").textContent = "Event Failed! -1 volume";
    }

    updateVolume();
    document.getElementById("userInput").value = "";

    setTimeout(() => {
        startNextEventCountdown();
    }, 1500);
}

function endEvent() {
    resetAllTimers();
    currentEventType = "ended";

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

function finalizeVolume() {
    stopTimer();

    if (nextEventTimer !== null) {
        clearInterval(nextEventTimer);
        nextEventTimer = null;
    }

    currentEventType = "finalized";

    document.getElementById("eventPrompt").textContent = "Final Volume: " + volume;

    document.getElementById("userInput").style.display = "none";
    document.getElementById("submitButton").style.display = "none";
    document.getElementById("undoColorButton").style.display = "none";
    document.getElementById("timerDisplay").style.display = "none";
    clearColorChoices();    
}