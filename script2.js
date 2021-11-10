const dataset = {
  nodes: [
    { id: 1, name: "ASMT", inicio: 1, fin: 0, dependencia: "in" },
    { id: 2, name: "CALC", inicio: 0, fin: 0, dependencia: "all" },
    { id: 3, name: "DEMO", inicio: 0, fin: 0, dependencia: "in" },
    { id: 4, name: "DEMO", inicio: 0, fin: 1, dependencia: "in" },
  ],
  links: [
    { source: 1, target: 3, left: false, right: true },
    { source: 2, target: 3, left: true, right: false },
  ],
  menu: [
    { id: 1, title: "Inicio" },
    { id: 2, title: "Fin" },
  ],
};

var menu = [
  {
    title:"Item 1",
    action: function(d) {
      console.log("Item 1 click");
      console.log("node ",d);
    }
  },
  {    
    title:"Item 2",
    action: function(d) {
      console.log("Item 2 click");
      console.log("node ",d);
    }
  }
];

var svg = d3.select("#CanvasContainer");

d3.contextMenu = function (d, menu, openCallback) {
  console.log("variables ", d, menu, openCallback);

	// create the div element that will hold the context menu
	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu');
	// close menu
	d3.select('#CanvasContainer').on('click.d3-context-menu', function() {
		d3.select('.d3-context-menu').style('display', 'none');
	});
	// this gets executed when a contextmenu event occurs
	return function(data, index) {
		var elm = this;
		d3.selectAll('.d3-context-menu').html('');
		var list = d3.selectAll('.d3-context-menu').append('ul');
		list.selectAll('li').data(menu).enter()
			.append('li')
			.html(function(d) {
				return d.title;
			})
			.on('click', function(d, i) {
				d.action(elm, data, index);
				d3.select('.d3-context-menu').style('display', 'none');
			});
		// the openCallback allows an action to fire before the menu is displayed
		// an example usage would be closing a tooltip
    console.log("63 ", openCallback);
		if (openCallback) openCallback(data, index);
		// display context menu
		d3.select('.d3-context-menu')
			.style('left', (d3.event.pageX - 2) + 'px')
			.style('top', (d3.event.pageY - 2) + 'px')
			.style('display', 'block');
		d3.event.preventDefault();
	};
};

// function restart() {
    var nodeStart = d3.select("#CanvasContainer")
    .append("div")
    .attr("id", "strat")
    .style("position", "absolute")
    .style("top", "140px")
    .style("left", "200px")
    .style("width", "200px")
    .style("height", "100px")
    .on("contextmenu",function(d, i){
      console.log("d e i ", d, i);
    })
    .append("div")
    .text("Click aquí para crear tu primer proceso");

    nodeStart.append("div")
    .append("spam")
    .append("i")
    .attr("class", "fas fa-robot spamIcon");

    d3.select('#strat').on("click", function(d, i) {
      console.log("menu ", d, i);
      var position = d3.mouse(this);
      console.log("position ",position);
      d3.select('#strat')
        .style('position', 'absolute')
        .style('left', position[0] + "px")
        .style('top', position[1] + "px")
        .style('display', 'block');
  
      d3.event.preventDefault();
  });
// }
