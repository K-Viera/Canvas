var svg = d3.select("#svgID")
var canvas=d3.select("#canvasID");
var width=parseFloat(canvas.attr("width"));
var height=parseFloat(canvas.attr("height"));
var r=3;
var ctx=canvas.node().getContext("2d");

var graph={
    nodes:[
        {name:"Uno"},
        {name:"dos"}
    ]
};

graph.nodes.forEach(function (d){
    d.x = Math.random()*width;
    d.y = Math.random()*height;
});

function update(){
    ctx.clearRect(0,0,width,height);
    ctx.beginPath();
    graph.nodes.forEach(drawNode);
    ctx.fill();
}

function drawNode(d){
    ctx.moveTo(d.x,d.y);
    ctx.arc(d.x,d.y,r,0,2*Math.PI)
 }

 update();