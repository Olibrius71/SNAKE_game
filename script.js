let canvas = document.querySelector("#principal");
let ctx = principal.getContext("2d");


ctx.fillStyle = "lime";
ctx.fillRect(0,0, canvas.width, canvas.height);

const squareSize = 30;


function drawQuadrillage() {
    let horizontal = 0;
    let vertical = 0;
    ctx.beginPath();

    while (horizontal <= canvas.width) {
        ctx.moveTo(horizontal, 0);
        ctx.lineTo(horizontal, canvas.height);
        horizontal += squareSize;
    }

    while (vertical <= canvas.height) {
        ctx.moveTo(0, vertical);
        ctx.lineTo(canvas.width, vertical);
        vertical += squareSize;
    }
    ctx.stroke();
}

function drawSquares() {
    let horizontal = 0;
    let vertical = 0;
    ctx.beginPath();
    ctx.fillStyle = "seagreen";

    let decale_actuellement = false;

    while (vertical + 30 <= canvas.height) {
        while (horizontal + 30 <= canvas.width) {
            ctx.moveTo(horizontal, vertical);
            ctx.lineTo(horizontal + squareSize, vertical);
            ctx.lineTo(horizontal + squareSize, vertical + squareSize);
            ctx.lineTo(horizontal, vertical + squareSize);
            ctx.lineTo(horizontal, vertical);
            horizontal += 2 * squareSize;
        }
        vertical+=30;
        if (decale_actuellement) {
            horizontal = 0;
            decale_actuellement = false;
        }
        else {
            horizontal = 30;
            decale_actuellement = true;
        }
    }

    ctx.fill();
}


drawQuadrillage();
drawSquares();





        /**********************
         * Display 1 : Navbar *
         **********************/

// {#homeBtn} contain the home button on the navbar
let homeBtn = document.getElementsByTagName('button').item(0);
// {#rightsBtn} contain the rights button on the navbar
let rulesBtn = document.getElementsByTagName('button').item(1);
// {#playBtn} contain the play button on the navbar
let playBtn = document.getElementsByTagName('button').item(2);

/**
 * Events displaying or not displaying the rules on the header when we click in rules button in the Navbar
 */
rulesBtn.addEventListener('click', event => {
    if(imgSwitch.getAttribute('src') == srcBottScrollLien) {
        displayRules();
    } else {
        notDisplayRules();
    }
});

/**
 * Events displaying or not displaying the rules on the header when we click in rules button in the Navbar
 */
homeBtn.addEventListener('click', event => {
    notDisplayRules();
});


        /**********************
         * Display 1 : Header *
         **********************/

// {#switchBtn} is the button for switch between welcome display and rights display
let switchBtn = document.getElementById('switch');
// {#rulesDisplay} contain the rights display
let rulesDisplay = document.querySelector('.rules-display');
// {#imgSwitch} contain the scroll line image
let imgSwitch = document.getElementsByTagName('img').item(1);
// - top scroll line src
    let srcTopScrollLine = 'img/ligne%20de%20défilement%20haut.png';
// - bott scroll line src
    let srcBottScrollLien = 'img/ligne%20de%20défilement%20bas.png';
// {#rulesTopBtn} designate the title named 'Rules' at the top of the scroll bar
let rulesTopbtn = document.getElementsByTagName('p').item(4);
// {#rulesBottBtn} designate the title named 'Rules' at the bottom of the scroll bar
let rulesBottBtn = document.getElementsByTagName('p').item(5);


function displayRules() {
    homeBtn.style.border = 'none';
    rulesBtn.style.borderBottom = '3px solid #199E58';
    rulesDisplay.style.display = 'flex';
    rulesTopbtn.style.display = "none";
    rulesBottBtn.style.display = "block";
    imgSwitch.setAttribute('src', srcTopScrollLine);
}

function notDisplayRules() {
    homeBtn.style.borderBottom = '3px solid #199E58';
    rulesBtn.style.borderBottom = 'none';
    rulesDisplay.style.display = 'none';
    rulesTopbtn.style.display = "block";
    rulesBottBtn.style.display = "none";
    imgSwitch.setAttribute('src', srcBottScrollLien);
}



/**
 * Events displaying or not displaying the rules on the header when we click in rules button in the Header
 */
switchBtn.addEventListener('click', event => {

    if(imgSwitch.getAttribute('src') == srcBottScrollLien) {
        displayRules();
    } else {
        notDisplayRules();
    }
});