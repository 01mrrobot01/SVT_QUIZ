//HBLF_Mrrobot
document.addEventListener('DOMContentLoaded', function() {
    const introContainer = document.getElementById('introContainer');
    const startButton = document.getElementById('startButton');
    const quizContainer = document.getElementById('quizContainer');
    const resultContainer = document.getElementById('resultContainer');
    const nameInput = document.getElementById('name');
    const submitButton = document.getElementById('submitButton');
    const questionContainer = document.getElementById('questionContainer');
    const resultDiv = document.getElementById('result');
    let userName = '';
    let currentQuestionIndex = 0;
    let score = 0;
    let questions = [];
    let answerStartTime;

    startButton.addEventListener('click', function() {
        userName = nameInput.value.trim();
        if (!userName) {
            alert('Veuillez entrer votre nom avant de commencer le quiz.');
            return;
        }
        
        introContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        startQuiz();
    });

    submitButton.addEventListener('click', function() {
        const selectedAnswer = document.querySelector(`input[name="q${currentQuestionIndex}"]:checked`);
        if (!selectedAnswer) {
            alert('Il est obligatoire de sélectionner une réponse. Veuillez répondre sérieusement.');
            return;
        }

        const timeTaken = Date.now() - answerStartTime;
        if (timeTaken < 2000) { // If the time taken is less than 2000 milliseconds (2 seconds)
            resetQuiz();
            alert('S\'il vous plaît répondez sérieusement ! Le quiz sera recommencé !');
            return;
        }

        const userAnswer = selectedAnswer.value;
        if (userAnswer === questions[currentQuestionIndex].answer) {
            score++;
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayCurrentQuestion();
        } else {
            displayFinalScore();
        }
    });

    function startQuiz() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data.questions;
                shuffleArray(questions);
                displayCurrentQuestion();
            })
            .catch(error => console.error('Erreur lors du chargement des questions :', error));
    }

    function displayCurrentQuestion() {
        const currentQuestion = questions[currentQuestionIndex];
        questionContainer.innerHTML = '';
        answerStartTime = Date.now();

        const questionTitle = document.createElement('h3');
        questionTitle.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
        questionContainer.appendChild(questionTitle);

        currentQuestion.choices.forEach(choice => {
            const label = document.createElement('label');
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${currentQuestionIndex}`;
            radio.value = choice;
            label.appendChild(radio);
            label.appendChild(document.createTextNode(choice));
            questionContainer.appendChild(label);
            questionContainer.appendChild(document.createElement('br'));
        });
    }

    function resetQuiz() {
        score = 0;
        currentQuestionIndex = 0;
        introContainer.style.display = 'block';
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'none';
    }

    function displayFinalScore() {
        quizContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        resultDiv.textContent = `${userName}, votre score final est de ${score} / ${questions.length}.`;
    }

    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }
});