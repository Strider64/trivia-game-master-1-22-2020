/*
 *  Trivia Game Version 4.55 beta using FETCH/JSON
 *  by John Pepp
 *  Started: January 14, 2020
 *  Revised: April 8, 2020 @ 10:00 PM
 */

'use strict';

/* Convert RGBa to HEX  */
const rgba2hex = (orig) => {
    var a,
            rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
            alpha = (rgb && rgb[4] || "").trim(),
            hex = rgb ?
            (rgb[1] | 1 << 8).toString(16).slice(1) +
            (rgb[2] | 1 << 8).toString(16).slice(1) +
            (rgb[3] | 1 << 8).toString(16).slice(1) : orig;

    if (alpha !== "") {
        a = alpha;
    } else {
        a = "01";
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1);
    hex = hex + a;

    return hex;
};

const myColor = (colorcode) => {
    var hexColor = rgba2hex(colorcode);
    return '#' + hexColor;
};

/*
 * Constants & Variables Initialization Section.
 */
const myGreen = myColor("rgba(29, 100, 31, 0.70)"); /* Green with 70% transparency */
const myRed = myColor("rgba(84, 0, 30, 0.70)"); /* Red with 70% transparency */

const quizUrl = 'qdatabase.php?'; // PHP database script 
const d = document; // Shorten docoment function::

const photographyBtn = d.querySelector('#photography');

const gameTitle = d.querySelector('.gameTitle');
const buttonContainer = d.querySelector('#buttonContainer');
const question = d.querySelector('#question');
const next = d.querySelector('#next');
const points = 100;
const scoreText = d.querySelector('#score');
const percent = d.querySelector('#percent');
const dSec = 20; // Countdown Clock for questions:

var gameIndex = 0,
        gameData = null, // Array of Objects (id, questions and answers):
        timer = null,
        score = 0,
        total = 0,
        answeredRight = 0,
        answeredWrong = 0,
        choose = d.querySelector('#selectCat');

var responseAns = {};

const buttons = d.querySelectorAll(".answerButton");
const mainGame = d.querySelector('#mainGame');


/*
 * Start and Stop Functions for Countdown Timer For Triva Game
 */
const startTimer = (dSec) => {
    var seconds = dSec;
    const userAnswer = 5, correct = 1;
    const newClock = d.querySelector('#clock');

    newClock.style['color'] = 'white';
    newClock.textContent = ((seconds < 10) ? `0${seconds}` : seconds);
    const countdown = () => {
        if (seconds === 0) {
            clearTimeout(timer);
            newClock.style['color'] = myRed;
            newClock.textContent = "00";

            scoringFcn(userAnswer, correct);
            highlightFCN(userAnswer, correct);
            calcPercent(answeredRight, total);
            disableListeners();
            next.addEventListener('click', removeQuiz, false);
        } else {
            newClock.textContent = ((seconds < 10) ? `0${seconds}` : seconds);
            seconds--;
        }
    };




    timer = setInterval(countdown, 1000);

};

const stopTimer = () => {
    clearInterval(timer);
};

/* Highlight correct or wrong answers */
const highlightFCN = (userAnswer, correct) => {
    const highlights = d.querySelectorAll('.answerButton');
    highlights.forEach(answer => {

        /*
         * Highlight Answers Function
         */

        /*
         * User answered correctly
         */
        if (userAnswer === correct && userAnswer === parseInt(answer.getAttribute('data-correct'))) {
            answer.style["background-color"] = myGreen;
        }

        /*
         * User ansered incorrectly
         */
        if (userAnswer !== correct && userAnswer === parseInt(answer.getAttribute('data-correct'))) {
            answer.style['background-color'] = myRed;
        }
        if (userAnswer !== correct && correct === parseInt(answer.getAttribute('data-correct'))) {
            answer.style['background-color'] = myGreen;
        }

        /*
         * User let timer run out
         */
        if (userAnswer === 5) {
            answer.style['background-color'] = myRed;
        }
    });
};

/* Disable Listeners, so users can't click on answer buttons */
const disableListeners = () => {
    const myButtons = d.querySelectorAll('.answerButton');
    myButtons.forEach(answer => {
        answer.removeEventListener('click', clickHandler, false);
    });
};

/* Calculate Percent */
const calcPercent = (correct, total) => {
    var average = (correct / total) * 100;
    percent.textContent = average.toFixed(0) + "%";
};

/* Figure out Score */
const scoringFcn = (userAnswer, correct) => {
    if (userAnswer === correct) {
        score += points;
        answeredRight++;
        scoreText.textContent = `Score ${score} Points`;
    } else {
        score = score - (points / 2);
        answeredWrong++;
        scoreText.textContent = `Score ${score} Points`;
    }
    total++;
};

/*
 * Throw error response if something is wrong: 
 */
const handleErrors = (response) => {
    if (!response.ok) {
        throw (response.status + ' : ' + response.statusText);
    }
    return response.json();
};

/* Success function utilizing FETCH */
const checkUISuccess = function (parsedData) {
    var correct = parseInt(parsedData.correct);
    var userAnswer = parseInt(d.querySelector('#headerStyle').getAttribute('data-user'));
    scoringFcn(userAnswer, correct);
    calcPercent(answeredRight, total);
    highlightFCN(userAnswer, correct);

    disableListeners();
    next.addEventListener('click', removeQuiz, false);
};

/* If Database Table fails to load then hard code the correct answers */
const checkUIError = function (error) {

    switch (gameData[gameIndex].id) {
        case 1:
            var correct = gameData[gameIndex].correct;
            break;
        case 55:
            var correct = gameData[gameIndex].correct;
            break;
        case 9:
            var correct = gameData[gameIndex].correct;
    }
    var userAnswer = parseInt(d.querySelector('#headerStyle').getAttribute('data-user'));
    scoringFcn(userAnswer, correct);
    calcPercent(answeredRight, total);
    highlightFCN(userAnswer, correct);

    disableListeners();
    next.addEventListener('click', removeQuiz, false);

};

/* create FETCH request */
const checkRequest = function (url, succeed, fail) {
        fetch(url, {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(responseAns)

        })
                .then((response) => handleErrors(response))
                .then((data) => succeed(data))
                .catch((error) => fail(error));
};

/* User has made selection */
const clickHandler = (e) => {
    const userAnswer = parseInt(e.target.getAttribute('data-correct'));
    responseAns.id = parseInt(gameData[gameIndex].id); // { id: integer } 
    const checkUrl = "check.php";
    stopTimer();
    checkRequest(checkUrl, checkUISuccess, checkUIError);
    d.querySelector('#headerStyle').setAttribute('data-user', userAnswer);
};

/* Remove answers from Screen */
const removeAnswers = () => {
    let element = d.querySelector('#buttonContainer');
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
};

/* Reset the Game */
const resetGame = () => {
    removeAnswers();
    stopTimer();
    score = 0;
    total = 0;
    answeredRight = 0;
    answeredWrong = 0;
    gameIndex = 0;
    gameData = null;
    scoreText.textContent = 'Score 0 Points';
    percent.textContent = '100';
};

/* Remove Question & Answers */
const removeQuiz = () => {
    removeAnswers(); // Call removeAnswers FCN:
    next.removeEventListener('click', removeQuiz, false);
    gameIndex++;

    if (gameIndex < parseInt(gameData.length)) {
        createQuiz(gameData[gameIndex]); // Recreate the Quiz Display:
    } else {
        question.textContent = 'Game Over';
    }
};

/* Populate Question, Create Answer Buttons */
const createQuiz = (gameData) => {

    /*
     * The Element interface's scrollIntoView() method scrolls the element's
     * parent container such that the element on which 
     * scrollIntoView() is called is visible to the user
     */
    d.getElementById('mainGame').scrollIntoView();

    startTimer(dSec);

    question.textContent = gameData.question;

    /*
     * Create Buttons then insert answers into buttons that were
     * create. 
     */
    gameData.answers.forEach((value, index) => {
        /*
         * Don't Show Answers that have a Blank Field
         */
        if (value !== "") {
            var gameButton = buttonContainer.appendChild(d.createElement('button'));
            gameButton.id = 'answer' + (index + 1);
            gameButton.className = 'answerButton';
            gameButton.setAttribute('data-correct', (index + 1));
            gameButton.addEventListener('click', clickHandler, false);
            gameButton.appendChild(d.createTextNode(value));
        }
    });
};

/* Success function utilizing FETCH */
const quizUISuccess = (parsedData) => {
    console.log('Data', parsedData);
    mainGame.style.display = 'block';
    //gameData = parsedData.sort(() => Math.random() - .5); // randomize questions:
    gameData = parsedData;
    createQuiz(gameData[gameIndex]);

};

/* If Database Table fails to load then answer a few hard coded Q&A */
const quizUIError = (error) => {
    console.log("Database Table did not load", error);

    gameData = [
        {
            id: 1,
            question: "What actor from the movie \"Dead Poets Society\" plays Dr. James Wilson on the TV show ",
            correct: 2,
            category: "movie",
            answers: ["Ethan Hawke", "Robert Sean Leonard", "James Waterston"]

        },
        {
            id: 55,
            question: "Who has won the most Oscars for Best Actress?",
            correct: 2,
            category: "movie",
            answers: ["Meryl Streep", "Katharine Hepburn", "Audrey Hepburn", "Jane Fonda"]
        },
        {
            id: 9,
            question: "Who played Jor-El in \"Superman (1978)\"?",
            correct: 4,
            category: "movie",
            answers: ["Glenn Ford", "Ned Beatty", "Christopher Reed", "Marlon Brando"]
        }
    ];

    /* Display HTML Game Display and create Quiz */
    mainGame.style.display = 'block';

    createQuiz(gameData[gameIndex]);
};

/* create FETCH request */
const createRequest = (url, succeed, fail) => {
    fetch(url)
            .then((response) => handleErrors(response))
            .then((data) => succeed(data))
            .catch((error) => fail(error));
};

/*
 * Start Game by Category
 */
const selectCat = function (category) {
    var api_key = d.querySelector('.triviaContainer').getAttribute('data-key');
    //var api_key = '42857078e4de89da3d432bd4456faf56c4a6c58f6378332f6f2b0d6ff107f9d9';
    const requestUrl = `${quizUrl}category=${category}&api_key=${api_key}`;

    createRequest(requestUrl, quizUISuccess, quizUIError);

};


const capitalize = (s) => {
    if (typeof s !== 'string')
        return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
};

const selection = (e) => {
    e.preventDefault(); // Prevent the select HTML tag from firing:
    var category = e.target.value; // Grab the user's selection:
    d.querySelector('.gameTitle').textContent = `${capitalize(category)} Trivia`; // Assign the h2 HTML tag the title of the category:
    d.querySelector('.triviaContainer').style.display = "block"; // Turn on the selection category (I don't think it's really need?):
    resetGame(); // reset the game
    selectCat(category); // call the select function with the category that was selected:
    console.log(e.target.value); // console debugging tool: 
};

choose.addEventListener('change', selection, false);

d.querySelector('.gameTitle').textContent = "Photography";
selectCat('photography');
