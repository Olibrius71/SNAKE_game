"use strict";
/*jshint esversion: 6 */

/** @type {String} variable qui pointe le fichier json 'easy' */
var url_easy = "niveaux/easy.json";

/** @type {String} variable qui pointe le fichier json 'normal' */
var url_normal = "niveaux/normal.json";

/** @type {String} variable qui pointe le fichier json 'hardcore' */
var url_hardcore = "niveaux/hardcore.json";

var largeur = null;


var difficulte = null;

var DIFFICULTES = {
    easy: [],
    normal: [],
    hardcore: []
};

/** Fonction permettant de récuperer les dimensions du jeu avec un fichier json */
function loadDataAndApply(url) {
    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw ("Erreur: " + response.status);
            }
        })
        .then(function (data) {
            largeur = data.squareDimension;
            difficulte = data.callToMethodToMoveSnakeSpeed;
            switch (url) {
                case url_easy:
                    DIFFICULTES.easy = [largeur,difficulte];
                    break;
                case url_normal:
                    DIFFICULTES.normal = [largeur,difficulte];
                    break;
                case url_hardcore:
                    DIFFICULTES.hardcore = [largeur,difficulte];
                    break;
            }
        })
        .catch(function (erreur) {
            console.log(erreur);
        });
}

loadDataAndApply(url_normal); // La difficulté est initialisé sur normal

var current_difficulte = "normal";

var modeChoixBox = document.getElementById("cb-mode"); /** Récupération de la combo box pour le choix de mode */

var easy_already_loaded = false;
var hardcore_already_loaded = false;

/** Évenement permettant de capturer le choix dans la combo box mode */
modeChoixBox.addEventListener("change", function () {
        switch (modeChoixBox.value) {
            case "Easy":
                console.log(current_difficulte);
                if (current_difficulte !== "easy") {
                    console.log("heh");
                    if (!easy_already_loaded) {
                        loadDataAndApply(url_easy);
                        easy_already_loaded = true;
                    }
                    else {
                        largeur = DIFFICULTES.easy[0];
                        difficulte = DIFFICULTES.easy[1];
                    }
                    current_difficulte = "easy";
                }
                break;
            case "Medium":
                if (current_difficulte !== "normal") {
                    largeur = DIFFICULTES.normal[0];
                    difficulte = DIFFICULTES.normal[1];
                    current_difficulte = "normal";
                }
                break;
            case "Hardcore":
                if (current_difficulte !== "hardcore") {
                    console.log("heh");
                    if (!hardcore_already_loaded) {
                        loadDataAndApply(url_hardcore);
                        hardcore_already_loaded = true;
                    }
                    else {
                        largeur = DIFFICULTES.hardcore[0];
                        difficulte = DIFFICULTES.hardcore[1];
                    }
                    current_difficulte = "hardcore";
                }
                break;
        }
    });



var retryButton = document.getElementById("retry"); /** Variable qui capture l'id du boutton 'retry' */

function game() {


    //let difficulte = prompt("EASY, NORMAL ou HARDCORE?");
    //difficulte = (difficulte.toUpperCase() === "EASY") ? 520 : (difficulte.toUpperCase() === "NORMAL") ? 355 : 160;


    retryButton.disabled = true;
    retryButton.style.opacity = 0.6;

    var canvas_fond = document.querySelector("#fond");
    var ctx_fond = canvas_fond.getContext("2d");

    ctx_fond.fillStyle = "gold";
    ctx_fond.fillRect(0, 0, canvas_fond.width, canvas_fond.height);

    var canvas = document.querySelector("#principal");
    var ctx = canvas.getContext("2d");


    ctx.fillStyle = "lime";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //const largeur = 13;

    var WORLD = [...Array(largeur)].map(e => Array(largeur).fill("VERT_CLAIR")); /** Tableau représentant l'environnement du snake */

    /** Fonction permettant de quadriller l'environnement */
    function fillArrayWorld() {
        for (var i in WORLD) {
            for (var j in WORLD) {
                if (i % 2 === 0) {
                    if (j % 2 === 0) {
                        WORLD[i][j] = "VERT_FONCE";
                    }
                } else {
                    if (j % 2 !== 0) {
                        WORLD[i][j] = "VERT_FONCE";
                    }
                }
            }
        }
    }

    fillArrayWorld();


    var SNAKE = []; /** Tableau contenant le snake */

    /**
     * Palette des couleurs utilisées
     */
    var couleur_carreau_clair = "lime";
    var couleur_carreau_clair_hexa = "#00ff00";
    var couleur_carreau_fonce = "seagreen";
    var couleur_carreau_fonce_hexa = "#2e8b57";
    var couleur_snake = "royalblue";
    var couleur_snake_hexa = "#4169e1";
    var couleur_food = "orangered";
    var couleur_food_hexa = "#ff4500";


    /** Fonction permettant de déterminer la couleur de chaque case de l'environnement */
    function determineVertClairOuFonce(iInWORLD, jInWORLD) {
        var x = Math.round(jInWORLD * squareSize);
        var y = Math.round(iInWORLD * squareSize);
        if (Math.round(y / squareSize) % 2 === 0) {
            if (Math.round(x / squareSize) % 2 === 0) {
                return couleur_carreau_fonce;
            }
            return couleur_carreau_clair;
        }
        if (Math.round(x / squareSize) % 2 === 0) {
            return couleur_carreau_clair;
        }
        return couleur_carreau_fonce;

    }


    /** Fonction permettant de colorier chaque en fonction du déplacement du snake
     * @param iInWORLD définit l'axe des abscices
     * @param jInWORLD définit l'axe des ordonnées
     */
    function colorSquare(iInWORLD, jInWORLD) {
        ctx.beginPath();

        if (ctx.fillStyle !== couleur_snake_hexa && ctx.fillStyle !== couleur_food_hexa) {
            ctx.fillStyle = determineVertClairOuFonce(iInWORLD, jInWORLD);
        }
        
        var x = Math.round(jInWORLD * squareSize);
        var y = Math.round(iInWORLD * squareSize);

        ctx.fillRect(x, y, squareSize, squareSize);

        if (ctx.fillStyle === couleur_carreau_clair_hexa) {
            WORLD[iInWORLD][jInWORLD] = "VERT_CLAIR";
        } else if (ctx.fillStyle === couleur_carreau_fonce_hexa) {
            WORLD[iInWORLD][jInWORLD] = "VERT_FONCE";
        } else if (ctx.fillStyle === couleur_snake_hexa) {
            WORLD[iInWORLD][jInWORLD] = "SNAKE";
        }
        ctx.fill();
    }

    var squareSize = canvas.width / largeur; /** Variable qui définit la taille de chaque tuiles */

    /** Fonction permettant de dessiner chaque tuiles */
    function drawSquares() {
        ctx.beginPath();
        ctx.fillStyle = couleur_carreau_fonce;

        for (var i in WORLD) {
            for (var j in WORLD) {
                colorSquare(i, j);
            }
        }
    }


    drawSquares();

    /** Fonction permettant d'initialier la position initiale du snake */
    function initializeSnake() {
        ctx.fillStyle = couleur_snake;

        colorSquare(9, 2);
        colorSquare(9, 3);
        colorSquare(9, 4);

        SNAKE = [[9, 2], [9, 3], [9, 4]];
    }

    initializeSnake();

    /** Fonction permettant de faire apparaître les pommes */
    function spawnFood() {
        ctx.fillStyle = couleur_food;

        var horizontal_snake = [];
        var vertical_snake = [];

        console.log(SNAKE);
        for (var i=0;i<SNAKE.length;i++) {
            horizontal_snake.push(SNAKE[i][0]);
            vertical_snake.push(SNAKE[i][1]);
        }

        console.log(horizontal_snake + " " + vertical_snake);

        var random_x = horizontal_snake[0];
        var random_y = vertical_snake[0];

        while (horizontal_snake.includes(random_x) && vertical_snake.includes(random_y)) {
            random_x = Math.floor(Math.random() * largeur);
            random_y = Math.floor(Math.random() * largeur);
        }


        WORLD[random_x][random_y] = "FOOD";
    }

    spawnFood();

    /** Variable qui défnit la direction à suivre du snake ; initialisé sur la droite */
    var direction = "right";

    /** Fonction permettant d'afficher l'environnement */
    function afficher() {
        //console.log(WORLD);
        for (var i in WORLD) {
            for (var j in WORLD) {
                if (WORLD[i][j] === "SNAKE") {
                    ctx.fillStyle = couleur_snake;
                } else if (WORLD[i][j] === "FOOD") {
                    ctx.fillStyle = couleur_food;
                } else {
                    ctx.fillStyle = couleur_carreau_fonce;
                }
                colorSquare(i, j);
            }
        }

    }

    /** Fonction qui redéfinit les coordonnées du snake dans le tableau en fonction de la direction prise */
    function avancer() {
        var head_snake = SNAKE[SNAKE.length - 1];
        var tail_snake = SNAKE[0];

        switch (direction) {
            case "up":
                if (head_snake[0] > 0) {
                    SNAKE.shift();
                    SNAKE.push([head_snake[0] - 1, head_snake[1]]);
                    if (WORLD[head_snake[0] - 1][head_snake[1]] === "SNAKE") {
                        dieSnake();
                    }
                    if (WORLD[head_snake[0] - 1][head_snake[1]] === "FOOD") {
                        foodEaten(tail_snake[0] + 1, tail_snake[1]);
                    }
                    WORLD[head_snake[0] - 1][head_snake[1]] = "SNAKE";
                } else {
                    dieSnake();
                }
                break;
            case "right":
                if (head_snake[1] < largeur - 1) {
                    SNAKE.shift();
                    SNAKE.push([head_snake[0], head_snake[1] + 1]);
                    if (WORLD[head_snake[0]][head_snake[1] + 1] === "SNAKE") {
                        dieSnake();
                    }
                    if (WORLD[head_snake[0]][head_snake[1] + 1] === "FOOD") {
                        foodEaten(tail_snake[0], tail_snake[1] - 1);
                    }
                    WORLD[head_snake[0]][head_snake[1] + 1] = "SNAKE";
                } else {
                    dieSnake();
                }
                break;
            case "down":
                if (head_snake[0] < largeur - 1) {
                    SNAKE.shift();
                    SNAKE.push([head_snake[0] + 1, head_snake[1]]);
                    if (WORLD[head_snake[0] + 1][head_snake[1]] === "SNAKE") {
                        dieSnake();
                    }
                    if (WORLD[head_snake[0] + 1][head_snake[1]] === "FOOD") {
                        foodEaten(tail_snake[0] - 1, tail_snake[1]);
                    }
                    WORLD[head_snake[0] + 1][head_snake[1]] = "SNAKE";
                } else {
                    dieSnake();
                }
                break;
            case "left":
                if (head_snake[1] > 0) {
                    SNAKE.shift();
                    SNAKE.push([head_snake[0], head_snake[1] - 1]);
                    if (WORLD[head_snake[0]][head_snake[1] - 1] === "SNAKE") {
                        dieSnake();
                    }
                    if (WORLD[head_snake[0]][head_snake[1] - 1] === "FOOD") {
                        foodEaten(tail_snake[0], tail_snake[1] + 1);
                    }
                    WORLD[head_snake[0]][head_snake[1] - 1] = "SNAKE";
                } else {
                    dieSnake();
                }
                break;
        }
        if (determineVertClairOuFonce(tail_snake[0], tail_snake[1]) === couleur_carreau_clair) {
            WORLD[tail_snake[0]][tail_snake[1]] = "VERT_CLAIR";
        } else {
            WORLD[tail_snake[0]][tail_snake[1]] = "VERT_FONCE";
        }

    }

    var afficherWorld = setInterval(afficher, 100); /** Variable qui actualise l'environnement */
    afficher();
    avancer();
    
    var avancerSnake = setInterval(avancer, difficulte); /** Variable qui défninit la vitesse de l'avancer du snake en fonction de la difficulté */

    /** Fonction qui initialise les permissions de déplacement si le snake monte */
    function turnUp() {
        direction = "up";
        turnRightAllowed = true;
        turnLeftAllowed = true;
        turnDownAllowed = false;
    }

    /** Fonction qui initialise les permissions de déplacement si le snake va à droite */
    function turnRight() {
        direction = "right";
        turnUpAllowed = true;
        turnDownAllowed = true;
        turnLeftAllowed = false;
    }

    /** Fonction qui initialise les permissions de déplacement si le snake dessend */
    function turnDown() {
        direction = "down";
        turnRightAllowed = true;
        turnLeftAllowed = true;
        turnUpAllowed = false;
    }

    /** Fonction qui initialise les permissions de déplacement si le snake tourne à gauche */
    function turnLeft() {
        direction = "left";
        turnUpAllowed = true;
        turnDownAllowed = true;
        turnRightAllowed = false;
    }

    var turnUpAllowed = true;
    var turnRightAllowed = true;
    var turnDownAllowed = true;
    var turnLeftAllowed = false;

    /** Évenement permettant de capturer les fl!ches directionelles et de mettre à jour le déplacement du snake */
    document.addEventListener("keydown", (e) => {
        switch (e.code) {
            case "ArrowUp":
            case "KeyW":
                e.preventDefault();
                if (turnUpAllowed) turnUp();
                break;
            case "ArrowRight":
            case "KeyD":
                e.preventDefault();
                if (turnRightAllowed) turnRight();
                break;
            case "ArrowDown":
            case "KeyS":
                e.preventDefault();
                if (turnDownAllowed) turnDown();
                break;
            case "ArrowLeft":
            case "KeyA":
                e.preventDefault();
                if (turnLeftAllowed) turnLeft();
                break;
        }
    });


    /** Fonction permettant de capturer la mort du snake */
    function dieSnake() {
        ctx.fillStyle = "#199E58";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        clearInterval(afficherWorld);
        clearInterval(avancerSnake);


        ctx.fillStyle = 'white';
        ctx.font = '60px Verdana';
        ctx.fillText("GAME OVER", canvas.width / 5, canvas.height / 1.9); // Affichage game over si snake mort

        // Init score
        if (current_score > high_score_html.textContent) {
            high_score_html.textContent = current_score;
            document.cookie = "highScore=" + current_score;
        }

        current_size.textContent = 0;
        retryButton.disabled = false;
        retryButton.style.opacity = 1;
    }

    /** Gestion des cookies pour sauvegarder le high score */
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


    var high_score_html = document.getElementById("high-score");
    if (document.cookie.indexOf("highScore=") === -1) {
        document.cookie = "highScore=0";
    } else {
        high_score_html.textContent = getCookie("highScore")
    }

    var current_score_html = document.getElementById("current-score");
    current_score_html.textContent = 0;
    current_score_html.style.color = "white";
    var current_score = 0;


var current_size = document.getElementById("current-size");

    /** Fonction permettant de mettre à jour les valeurs en cas de collision avec la pomme */
    function foodEaten(x, y) {
        SNAKE.unshift([x, y]);
        console.log(current_score_html);
        current_score++;
        current_size.textContent++;
        current_score_html.textContent++;
        if (current_score>high_score_html.textContent) {
            current_score_html.style.color = "red";
        }
        spawnFood();
    }
}

var playButton = document.getElementById("mainPlayBtn");


mainPlayBtn.addEventListener("click", () => {
    game();
});



retryButton.addEventListener("click", () => {
    game();
});
