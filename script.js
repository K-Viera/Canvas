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

var simulation = d3.forceSimulation(graph.nodes)
.force("link",d3.forceLink(graph.links)
    .id(function(d){return d.name;}))
.force("charge",d3.forceManyBody().strength(-10))
.force("center",d3.forceCenter(width/2,height/2))
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
    .enter().append("g")
    .attr("class", "node")
    .attr("r", 10)
    .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
.on("end", dragended));

node.append("circle")
    .attr("r", d=> 17)//+ d.runtime/20 )
    .style("stroke", "grey")
    .style("stroke-opacity",0.3)
node.append("title")
.text("hola");

node.append("text")
    .attr("dy", 4)
    .attr("dx", -15)
    .text(d => d.name);

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
};

function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}

function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}