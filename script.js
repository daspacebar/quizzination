const startButton = document.getElementById("start-quiz-button")

startButton.addEventListener("click", fetchJson, {once: true})

let currentQuestionIndex = 0;
let questions = [];
let score = 0;
let timer;

function fetchJson(){
    startButton.style.display = 'none'; // Hide start button after starting quiz
    fetch("data.json")
    .then(response => response.json())
    .then(data => {
        questions = data.questions;
        currentQuestionIndex = 0;
        score = 0;
        randomizeOptions();
        displayQuestion(currentQuestionIndex);
    })
    .catch(error => console.error("Error fetching data from JSON", error));
}

function randomizeOptions() {
    questions.forEach(question => {
        question.options = question.options.sort(() => Math.random() - 0.5);
    });
}

function displayQuestion(index) {
    const welcomeText = document.querySelector("h1");
    if (welcomeText) {
        welcomeText.style.display = "none";
    }
    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = ""; // Clear previous question

    clearTimeout(timer);

    if (index < questions.length) {
        const question = questions[index];
        const questionElement = document.createElement("p");
        questionElement.textContent = `${index + 1}. ${question.question}`;
        questionElement.className = 'quiz-question';

        const optionsList = document.createElement("div");
        optionsList.className = 'quiz-options';

        question.options.forEach(option => {
            const optionElement = document.createElement("button");
            optionElement.textContent = option;
            optionElement.className = 'quiz-option';

            optionElement.addEventListener("click", () => {
                clearTimeout(timer);
                if (option === question.answer) {
                    optionElement.classList.add('correct');
                    score++;
                } else {
                    optionElement.classList.add('incorrect');
                }
                setTimeout(() => {
                    currentQuestionIndex++;
                    displayQuestion(currentQuestionIndex);
                }, 1000);
            }, {once: true});
            optionsList.appendChild(optionElement);
        });

        dataDisplay.appendChild(questionElement);
        dataDisplay.appendChild(optionsList);

        startTimer();
    } else {
        displayResults();
    }
}

function startTimer() {
    let timeLeft = 5;
    const dataDisplay = document.getElementById("dataDisplay");
    const timerElement = document.createElement("p");
    timerElement.className = 'quiz-timer';
    dataDisplay.appendChild(timerElement);

    timer = setInterval(() => {
        timerElement.textContent = `Time Left: ${timeLeft}s`;
        timeLeft--;
        if (timeLeft < 0) {
            clearInterval(timer);
            currentQuestionIndex++;
            displayQuestion(currentQuestionIndex);
        }
    }, 1000);
}

function displayResults() {
    const dataDisplay = document.getElementById("dataDisplay");
    dataDisplay.innerHTML = "";

    const welcomeText = document.querySelector("h1");
    if (welcomeText) {
        welcomeText.style.display = "none";
    }

    const quizCompletedText = document.createElement("p");
    quizCompletedText.textContent = "Quiz Completed!";
    quizCompletedText.classList.add("quiz-completed");
    dataDisplay.appendChild(quizCompletedText);

    const scoreText = document.createElement("p");
    scoreText.textContent = `Your Score: ${score}/${questions.length}`;
    scoreText.classList.add("score-text");
    dataDisplay.appendChild(scoreText);

    const videoElement = document.createElement("video");
    videoElement.src = "assets/video.mp4";
    videoElement.autoplay = true;
    videoElement.controls = false;
    videoElement.loop = true;
    videoElement.muted = false;
    videoElement.classList.add("quiz-video");
    dataDisplay.appendChild(videoElement);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Restart Quiz";
    restartButton.className = 'quiz-restart-button';
    restartButton.addEventListener("click", () => {
        startButton.style.display = 'block';
        fetchJson();
    });
    dataDisplay.appendChild(restartButton);
}
