/**
 * let state is an integer representing the display [0 = Home ; 1 = Rules ; 2 = Game space].
 * @type {number}
 */
var state = 0; // init to 0

/**
 * let homeBtn contain the home button on the navbar.
 * @type {HTMLElement}
 */
var homeBtn = document.getElementsByTagName('button').item(0);

/**
 * let rulesBtn contain the rights button on the navbar.
 * @type {HTMLElement}
 */
var rulesBtn = document.getElementsByTagName('button').item(1);

/**
 * let playBtn contain the play button on the navbar.
 * @type {HTMLElement}
 */
var playBtn = document.getElementsByTagName('button').item(2);

/**
 * let header contain title and rules option.
 * @type {HTMLElement}
 */
var header = document.getElementById('header');

/**
 * let srcTopScrollLine contain the url of top scroll line image.
 * @type {string}
 */
var srcTopScrollLine = 'img/ligne%20de%20défilement%20haut.png';

/**
 * let srcBottScrollLine contain the url of bottom scroll line image.
 * @type {string}
 */
var srcBottScrollLien = 'img/ligne%20de%20défilement%20bas.png';

/**
 * let imgSwitch contain the scroll line image.
 * @type {HTMLImageElement}
 */
var imgSwitch = document.getElementsByTagName('img').item(1); // init to bottom scroll line image

/**
 * let switchBtn is the button for switch between welcome display and rules display.
 * @type {HTMLElement}
 */
var switchBtn = document.getElementById('switch');

/**
 * let rulesDisplay contain the rules.
 * @type {Element}
 */
var rulesDisplay = document.querySelector('.rules-display');

/**
 * let rulesTopBtn designate the title named 'Rules' at the top of the scroll bar.
 * @type {HTMLParagraphElement}
 */
var rulesTopBtn = document.getElementsByTagName('p').item(4);

/**
 * let rulesBottBtn designate the title named 'Rules' at the bottom of the scroll bar.
 * @type {HTMLParagraphElement}
 */
var rulesBottBtn = document.getElementsByTagName('p').item(5);

/**
 * let mainPlayBtn is the playButton on the main.
 * @type {HTMLElement}
 */
var mainPlayBtn = document.getElementById('mainPlayBtn');

/**
 * let gameSpace is the display of the snake game.
 * @type {HTMLElement}
 */
var gameSpace = document.getElementById('game-space');

/**
 * let exitGameSpace is the button in the game space allowing to exit the game.
 * @type {HTMLElement}
 */
var exitGameSpace = document.getElementById('gs-btn-exit');

/**
 * let main is the space that contain the the play button and the game space.
 * @type {HTMLElement}
 */
var main = document.getElementById('main');

/**
 * displayRules() is the function who displayed the rules in the header.
 */
function displayRules() {
    imgSwitch.setAttribute('src', srcTopScrollLine);
    homeBtn.style.border            = 'none';
    rulesBtn.style.borderBottom     = '3px solid #199E58';
    rulesDisplay.style.display      = 'flex';
    rulesTopBtn.style.display       = "none";
    rulesBottBtn.style.display      = "block";
}

/**
 * notDisplayRules() is the function who undisplayed the rules in the header.
 */
function notDisplayRules() {
    imgSwitch.setAttribute('src', srcBottScrollLien);
    homeBtn.style.borderBottom      = '3px solid #199E58';
    rulesBtn.style.borderBottom     = 'none';
    rulesDisplay.style.display      = 'none';
    rulesTopBtn.style.display       = "block";
    rulesBottBtn.style.display      = "none";
}

/**
 * dropMain() is the function who drop all content of the main when state = 0 or 1.
 */
function dropMain() {
    playBtn.style.borderBottom      = '3px solid #199E58';
    homeBtn.style.border            = 'none';
    rulesBtn.style.border           = 'none';
    mainPlayBtn.style.display       = "none";
    header.style.display            = "none";
    main.style.textAlign            = 'initial';
    main.style.alignItems           = 'initial';
    main.style.justifyContent       = 'initial';
    gameSpace.style.height          = 'initial';
}

/**
 * dropGameSpace() is the function who drop all content of the game space when state = 2.
 */
function dropGameSpace() {
    playBtn.style.borderBottom      = 'none';
    gameSpace.style.display         = "none";
    mainPlayBtn.style.display       = "inline-block";
    header.style.display            = "block";
    main.style.textAlign            = 'center';
    main.style.alignItems           = 'center';
    main.style.justifyContent       = 'center';
}

/**
 * addGameSpace() is the function allowing to display the game space.
 */
function addGameSpace() {
    gameSpace.style.display         = "flex";
}

/**
 * Events displaying or not displaying the rules on the header when rules button is clicked.
 */
rulesBtn.addEventListener('click', (event) => {
    if(state === 0) {
        displayRules();
        state = 1;
    } else if(state === 2) {
        dropGameSpace();
        displayRules();
        state = 1;
    } else {
        notDisplayRules();
        state = 0;
    }
});

/**
 * Events displaying the home on the header when home button is clicked.
 */
homeBtn.addEventListener('click', event => {
    if(state === 1) {
        notDisplayRules();
        state = 0;
    } else if (state === 2) {
        dropGameSpace();
        displayRules();
        notDisplayRules();
        state = 0;
    }
});

/**
 * Events displaying or not displaying the rules on the header when rules button is clicked.
 */
switchBtn.addEventListener('click', event => {

    if(state === 0) {
        displayRules();
        state = 1;
    } else if(state === 1) {
        notDisplayRules();
        state = 0;
    }
});

/**
 * Events display the game space when the play button on the main is clicked.
 */
mainPlayBtn.addEventListener('click', event => {
    if(state === 0 || state === 1) {
        dropMain();
        addGameSpace();
        state = 2;
    }
});

/**
 * Events display the game space when the play button on the navbar is clicked.
 */
playBtn.addEventListener('click', event => {
    if(state === 0 || state === 1) {
        dropMain();
        addGameSpace();
        state = 2;
    }
});

/**
 * Events allowing to exit the game space by the exit button when it's clicked.
 */
exitGameSpace.addEventListener('click', event => {
    dropGameSpace();
    displayRules();
    notDisplayRules();
    state = 0;
});
