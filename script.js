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
var width=400;
var height=400;

var simulation = d3.forceSimulation()
.force("x",d3.forceX(width/2))
.on("tick",tick);

var svg = d3.select("#graphID").append("svg")
    .attr("width", width)
    .attr("height", height);

var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("svg:line")
    .attr("class", "link");

var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("svg:circle")
    .attr("class", "node")
    .attr("r", 10);

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
 };