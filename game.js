let url_easy = "niveaux/easy.json";
let url_normal = "niveaux/normal.json";
let url_hardcore = "niveaux/hardcore.json";

let largeur = null;
let difficulte = null;

let DIFFICULTES = {
    easy: [],
    normal: [],
    hardcore: []
}

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
            //console.log(JSON.parse(JSON.stringify(largeur)));
        })
        .catch(function (erreur) {
            console.log(erreur);
        });
}

loadDataAndApply(url_normal);

let current_difficulte = "normal"

let modeChoixBox = document.getElementById("cb-mode");

let easy_already_loaded = false;
let hardcore_already_loaded = false;

modeChoixBox.addEventListener("change",() => {
    switch (modeChoixBox.value) {
        case "Easy":
            console.log(current_difficulte );
            if (current_difficulte!=="easy") {
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
            if (!current_difficulte!=="normal") {
                largeur = DIFFICULTES.normal[0];
                difficulte = DIFFICULTES.normal[1];
                current_difficulte = "normal";
            }
            break;
        case "Hardcore":
            if (!current_difficulte!=="hardcore") {
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



let retryButton = document.getElementById("retry");

function game() {


    //let difficulte = prompt("EASY, NORMAL ou HARDCORE?");
    //difficulte = (difficulte.toUpperCase() === "EASY") ? 520 : (difficulte.toUpperCase() === "NORMAL") ? 355 : 160;


    retryButton.disabled = true;
    retryButton.style.opacity = 0.6;

    let canvas_fond = document.querySelector("#fond");
    let ctx_fond = canvas_fond.getContext("2d");

    ctx_fond.fillStyle = "gold";
    ctx_fond.fillRect(0, 0, canvas_fond.width, canvas_fond.height);

    let canvas = document.querySelector("#principal");
    let ctx = canvas.getContext("2d");


    ctx.fillStyle = "lime";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //const largeur = 13;

    let WORLD = [...Array(largeur)].map(e => Array(largeur).fill("VERT_CLAIR"));

    function fillArrayWorld() {
        for (let i in WORLD) {
            for (let j in WORLD) {
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


    let SNAKE = [];

    let couleur_carreau_clair = "lime";
    let couleur_carreau_clair_hexa = "#00ff00";

    let couleur_carreau_fonce = "seagreen";
    let couleur_carreau_fonce_hexa = "#2e8b57";

    let couleur_snake = "royalblue";
    let couleur_snake_hexa = "#4169e1";

    let couleur_food = "orangered";
    let couleur_food_hexa = "#ff4500";


    function determineVertClairOuFonce(iInWORLD, jInWORLD) {
        let x = Math.round(jInWORLD * squareSize);
        let y = Math.round(iInWORLD * squareSize);
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


    function colorSquare(iInWORLD, jInWORLD) {
        ctx.beginPath();

        if (ctx.fillStyle !== couleur_snake_hexa && ctx.fillStyle !== couleur_food_hexa) {
            ctx.fillStyle = determineVertClairOuFonce(iInWORLD, jInWORLD);
        }
        //console.log(ctx.fillStyle + " " + x + " " + y);
        let x = Math.round(jInWORLD * squareSize);
        let y = Math.round(iInWORLD * squareSize);

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


    const squareSize = canvas.width / largeur;


    function drawSquares() {
        ctx.beginPath();
        ctx.fillStyle = couleur_carreau_fonce;

        for (let i in WORLD) {
            for (let j in WORLD) {
                colorSquare(i, j);
            }
        }
    }


    drawSquares();


    function initializeSnake() {
        ctx.fillStyle = couleur_snake;

        colorSquare(9, 2);
        colorSquare(9, 3);
        colorSquare(9, 4);

        SNAKE = [[9, 2], [9, 3], [9, 4]];
    }

    initializeSnake();


    function spawnFood() {
        ctx.fillStyle = couleur_food;

        let horizontal_snake = [];
        let vertical_snake = [];

        console.log(SNAKE);
        for (let i=0;i<SNAKE.length;i++) {
            horizontal_snake.push(SNAKE[i][0]);
            vertical_snake.push(SNAKE[i][1]);
        }

        console.log(horizontal_snake + " " + vertical_snake);

        let random_x = horizontal_snake[0];
        let random_y = vertical_snake[0];

        while (horizontal_snake.includes(random_x) && vertical_snake.includes(random_y)) {
            random_x = Math.floor(Math.random() * largeur);
            random_y = Math.floor(Math.random() * largeur);
        }


        WORLD[random_x][random_y] = "FOOD";
    }

    spawnFood();


    let direction = "right";

    function afficher() {
        //console.log(WORLD);
        for (let i in WORLD) {
            for (let j in WORLD) {
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


    function avancer() {
        let head_snake = SNAKE[SNAKE.length - 1];
        let tail_snake = SNAKE[0];

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

    let afficherWorld = setInterval(afficher, 100);
    afficher();
    avancer();
    console.log(difficulte + " " + largeur);
    let avancerSnake = setInterval(avancer, difficulte);


    function turnUp() {
        direction = "up";
        turnRightAllowed = true;
        turnLeftAllowed = true;
        turnDownAllowed = false;
    }

    function turnRight() {
        direction = "right";
        turnUpAllowed = true;
        turnDownAllowed = true;
        turnLeftAllowed = false;
    }

    function turnDown() {
        direction = "down";
        turnRightAllowed = true;
        turnLeftAllowed = true;
        turnUpAllowed = false;
    }

    function turnLeft() {
        direction = "left";
        turnUpAllowed = true;
        turnDownAllowed = true;
        turnRightAllowed = false;
    }

    let turnUpAllowed = true;
    let turnRightAllowed = true;
    let turnDownAllowed = true;
    let turnLeftAllowed = false;

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


    function dieSnake() {
        ctx.fillStyle = "#199E58";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        clearInterval(afficherWorld);
        clearInterval(avancerSnake);


        ctx.fillStyle = 'white';
        ctx.font = '60px Verdana';
        ctx.fillText("GAME OVER", canvas.width / 5, canvas.height / 1.9);


        if (current_score > high_score_html.textContent) {
            high_score_html.textContent = current_score;
            document.cookie = "highScore=" + current_score;
        }

        current_size.textContent = 0;
        retryButton.disabled = false;
        retryButton.style.opacity = 1;
    }

    function getCookie(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


    let high_score_html = document.getElementById("high-score");
    if (document.cookie.indexOf("highScore=") === -1) {
        document.cookie = "highScore=0";
    } else {
        high_score_html.textContent = getCookie("highScore")
    }

    let current_score_html = document.getElementById("current-score");
    current_score_html.textContent = 0;
    current_score_html.style.color = "black";
    let current_score = 0;


let current_size = document.getElementById("current-size");

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

let playButton = document.getElementById("mainPlayBtn");
mainPlayBtn.addEventListener("click", () => {
    game();
})



retryButton.addEventListener("click", () => {
    game();
});
