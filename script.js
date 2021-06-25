var a = document.getElementById("dibujo");
var ctx = a.getContext("2d");

var x = a.width/2;
var y = a.height-30;

var dx = 2;
var dy = -2;

var paddleHeight = 100;
var paddleWidth = 75;
var paddleX = (a.width-paddleWidth)/2;
var paddleY =200;

var ballRadius = 10;

function draw() {
    ctx.clearRect(0, 0, a.width, a.height);
    drawBall();
    drawPaddle();
    if(x + dx > a.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }else if(paddleY<y&&y<paddleY+paddleHeight)
    {
        if(x+ballRadius>paddleX&&x-ballRadius<paddleX+paddleWidth)
        {
            dx = -dx;
        }
    }
    if(y + dy > a.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }else if(paddleX<x&&x<paddleX+paddleWidth)
    {
        if(y+ballRadius>paddleY&&y-ballRadius<paddleY+paddleHeight)
        {
            dy = -dy;
        }
    }
    if(rightPressed && paddleX < a.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

setInterval(draw, 10);

var rightPressed = false;
var leftPressed = false;

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}