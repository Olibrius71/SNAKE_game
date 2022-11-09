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




