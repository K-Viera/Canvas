var graph={
    nodes:[
        {name:"uno"},
        {name:"dos"},
        {name:"tres"},
        {name:"cuatro"}
    ],
    links:[
        {source:"uno", target:"dos"},
        {source:"dos", target:"uno"},
        {source:"dos", target:"tres"},
        {source:"cuatro", target:"dos"}
    ]
};

var svg = d3.select("#svgID")
var canvas=d3.select("#canvasID");
var width=parseFloat(canvas.attr("width"));
var height=parseFloat(canvas.attr("height"));
var r=20;
var ctx=canvas.node().getContext("2d");

//Simulation fuctions
var simulation=d3.forceSimulation()
    .force("x",d3.forceX(width/2))
    .force("y",d3.forceY(height/2))
    .force("collide",d3.forceCollide(r+(r/3)))
    .force("carge",d3.forceManyBody().strength(-r))
    .force("link",d3.forceLink()
        .id(function(d){return d.name;}))
    .on("tick",update);

simulation.nodes(graph.nodes);
simulation.force("link").links(graph.links);


// graph.nodes.forEach(function (d){
//     d.x = Math.random()*width;
//     d.y = Math.random()*height;
// });

//Clean the canvas and draw each node
function update(){
    ctx.clearRect(0,0,width,height);

    ctx.beginPath();
    graph.links.forEach(drawLink);
    ctx.stroke();

    ctx.beginPath();
    graph.nodes.forEach(drawNode);
    ctx.fill();
}

//Draw the circle node in the canvas
function drawNode(d){
    ctx.moveTo(d.x,d.y);
    ctx.arc(d.x,d.y,r,0,2*Math.PI)
}

function drawLink(l)
{
    ctx.moveTo(l.source.x,l.source.y);
    ctx.lineWidth=6;
    ctx.lineTo(l.target.x,l.target.y)
}

update();