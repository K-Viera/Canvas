var a = document.getElementById("dibujo");
var ctx = a.getContext("2d");

var x = a.width/2;
var y = a.height-30;

var dx = 2;
var dy = -2;

var ballRadius = 10;

function draw() {
    ctx.clearRect(0, 0, a.width, a.height);
    drawBall();
    
    if(x + dx > a.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > a.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
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