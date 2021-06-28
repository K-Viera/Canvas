var graph={
    nodes:[
        {id:1,name:"uno"},
        {id:2,name:"dos"},
        {id:3,name:"tres"},
        {id:4,name:"cuatro"}
    ],
    links:[
        {source: 1, target: 3, type: 'Next -->>'},
        {source: 3, target: 2, type: 'Next -->>'},
        {source: 4, target: 1, type: 'Next -->>'},
        {source: 1, target: 2, type: 'Next -->>'},
        {source: 2, target: 3, type: 'Next -->>'},
        {source: 3, target: 1, type: 'Next -->>'},
    ]
};

var width=400;
var height=400;



var svg = d3.select("#graphID").append("svg")
    .attr("width", width)
    .attr("height", height);
svg.append('defs').append('marker')
    .attr("id",'arrowhead')
    .attr('viewBox','-0 -5 10 10') //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
     .attr('refX',23) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
     .attr('refY',0)
     .attr('orient','auto')
        .attr('markerWidth',13)
        .attr('markerHeight',13)
        .attr('xoverflow','visible')
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke','none');
    
var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("svg:line")
    .attr("class", "link")
    .attr('marker-end','url(#arrowhead)');

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
    .attr("r", 17)
    .style("stroke", "grey")
    .style("stroke-opacity",0.3)

node.append("text")
    .attr("dy", 4)
    .attr("dx", -15)
    .text(d => d.name);

var simulation = d3.forceSimulation(graph.nodes)
.force("link",d3.forceLink(graph.links)
    .id(function(d){return d.id;}).distance(100))
.force("charge",d3.forceManyBody().strength(-200))
.force("center",d3.forceCenter(width/2,height/2))
.on("tick",tick);

function tick() {
    link.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", d => `translate(${d.x},${d.y})`);
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