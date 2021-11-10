// set up SVG for D3
var aa;
var idNode;

const dataset = {
  nodes: [
    { id: 1, name: "ASMT", inicio: 1, fin: 0, dependencia: "in" },
    { id: 2, name: "CALC", inicio: 0, fin: 0, dependencia: "all" },
    { id: 3, name: "DEMO", inicio: 0, fin: 0, dependencia: "in" },
    { id: 4, name: "DEMO", inicio: 0, fin: 1, dependencia: "in" },
  ],
  links: [
    { source: 1, target: 3, left: false, right: true },
    { source: 2, target: 3, left: false, right: true },
  ],
  menu: [
    { id: 1, title: "Inicio" },
    { id: 2, title: "Fin" },
    { id: 3, title: "Dependencia Una" },
  ],
};

var width = 2000,
  height = 1500,
  colors = function () {
    return "#FFF";
  };

var svg = d3
  .select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var force = d3.layout
  .force()
  .nodes(dataset.nodes)
  .links(dataset.links)
  .size([width, height])
  .linkDistance(350)
  .charge(-1000)
  .on("tick", tick);
// define arrow markers for graph links
svg
  .append("svg:defs")
  .append("svg:marker")
  .attr("id", "end-arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 6)
  .attr("markerWidth", 3)
  .attr("markerHeight", 3)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("d", "M0,-5L10,0L0,5")
  .attr("fill", "#000");
svg
  .append("svg:defs")
  .append("svg:marker")
  .attr("id", "start-arrow")
  .attr("viewBox", "0 -5 10 10")
  .attr("refX", 4)
  .attr("markerWidth", 3)
  .attr("markerHeight", 3)
  .attr("orient", "auto")
  .append("svg:path")
  .attr("d", "M10,-5L0,0L10,5")
  .attr("fill", "#000");
// line displayed when dragging new nodes

var drag_line = svg
  .append("svg:path")
  .attr("class", "link dragline hidden")
  .attr("d", "M0,0L0,0");
// handles to link and node element groups
var path = svg.append("svg:g").selectAll("path"),
  rect = svg.append("svg:g").selectAll("g");
// mouse event vars
var selected_node = null,
  selected_link = null,
  mousedown_link = null,
  mousedown_node = null,
  mouseup_node = null;

function resetMouseVars() {
  mousedown_node = null;
  mouseup_node = null;
  mousedown_link = null;
}
// update force layout (called automatically each iteration)
function tick() {
  // draw directed edges with proper padding from node centers
  path.attr("d", function (d) {
    var deltaX = d.target.x - d.source.x,
      deltaY = d.target.y - d.source.y,
      dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
      normX = deltaX / dist,
      normY = deltaY / dist,
      sourcePadding = d.left ? 17 : 12,
      targetPadding = d.right ? 17 : 12,
      sourceX = d.source.x + sourcePadding * normX,
      sourceY = d.source.y + sourcePadding * normY,
      targetX = d.target.x - targetPadding * normX,
      targetY = d.target.y - targetPadding * normY;

    return (
      "M" +
      sourceX +
      "," +
      sourceY +
      // " C " +
      // sourceX +
      // "," +
      // (sourceY + targetY) / 2 +
      " " +
      targetX +
      "," +
      (sourceY + targetY) / 2 +
      " " +
      targetX +
      "," +
      targetY
    );
  });
  rect.attr("transform", function (d) {
    return "translate(" + d.x + "," + d.y + ")";
  });
}
// update graph (called when needed)
function restart() {
  if (dataset.links != 0) {
    // path (link) group
    path = path.data(dataset.links);
    // update existing links
    path
      .classed("selected", function (d) {
        return d === selected_link;
      })
      .style("marker-start", function (d) {
        return d.left ? "url(#start-arrow)" : "";
      })
      .style("marker-end", function (d) {
        return d.right ? "url(#end-arrow)" : "";
      });
    // add new links
    path
      .enter()
      .append("svg:path")
      .attr("class", "link")
      .classed("selected", function (d) {
        return d === selected_link;
      })
      .style("marker-start", function (d) {
        return d.left ? "url(#start-arrow)" : "";
      })
      .style("marker-end", function (d) {
        return d.right ? "url(#end-arrow)" : "";
      })
      .on("mousedown", function (d) {
        if (d3.event.ctrlKey) return;
        // select link
        mousedown_link = d;
        if (mousedown_link === selected_link) selected_link = null;
        else selected_link = mousedown_link;
        selected_node = null;
        restart();
      });
    // remove old links
    path.exit().remove();
  }
  if (dataset.nodes != 0) {
    rect = rect.data(dataset.nodes, function (d) {
      return d.id;
    });
    // update existing nodes (reflexive & selected visual states)
    rect
      .selectAll("rect")
      .style("fill", function (d) {
        return d === selected_node
          ? d3.rgb(colors(d.id)).darker().toString()
          : colors(d.id);
      })
      .classed("reflexive", function (d) {
        return d.reflexive;
      });
    // add new nodes
    var g = rect.enter().append("svg:g");
    g.append("svg:rect")
      .attr("class", "node")
      .attr("width", 120)
      .attr("height", 50)
      .style("fill", function (d) {
        return d === selected_node
          ? d3.rgb(colors(d.id)).brighter().toString()
          : colors(d.id);
      })
      .style("stroke", function (d) {
        return d.inicio == 1
          ? d3.rgb("green")
          : d.fin == 1
          ? d3.rgb("red")
          : d3.rgb(colors(d.id)).darker().toString();
      })
      .classed("reflexive", function (d) {
        return d.reflexive;
      })
      .on("contextmenu", function (d, i) {
        // create the div element that will hold the context menu
        d3.selectAll(".context-menu")
          .data([1])
          .enter()
          .append("div")
          .attr("class", "context-menu");
        // close menu
        d3.select("svg").on("click", function () {
          d3.select(".context-menu").style("display", "none");
        });
        // this gets executed when a contextmenu event occurs
        d3.selectAll(".context-menu")
          .html("")
          .append("ul")
          .selectAll("li")
          .data(function (d) {
            (dataset.nodes[i].dependencia == "in") ?
            dataset.menu[2].title = "Dependencia Una" :
            dataset.menu[2].title = "Dependencia Todas"
            return dataset.menu;
          })
          .enter()
          .append("li")
          .text(function (d) {
            return d.title;
          })
          .on("click", function (d) {
            console.log("clic ", d)
            dataset.nodes.map(function (node) {
              if (d.id == 1) {
                if (node.inicio == 1) {
                  node.inicio = 0;
                }
                if (node.id == idNode) {
                  node.inicio = 1;
                }
              }
              if (d.id == 2) {
                if (node.fin == 1) {
                  node.fin = 0;
                }
                if (node.id == idNode) {
                  node.fin = 1;
                }
              }
              if (d.id == 3) {
                if (node.id == idNode) {
                  node.dependencia == "in" ? 
                  node.dependencia = "all" : 
                  node.dependencia = "in";
                }
              }

              d3.select(".context-menu").style("display", "none");

              return node;
              restart();
            });
          });
        // show the context menu
        d3.select(".context-menu")
          .style("left", d3.event.pageX - 2 + "px")
          .style("top", d3.event.pageY - 2 + "px")
          .style("display", "block");

        idNode = d3.event.path[1].__data__.id;

        d3.event.preventDefault();
      })
      .on("mouseover", function (d) {
        if (!mousedown_node || d === mousedown_node) return;
        // enlarge target node
        d3.select(this).attr("transform");
      })
      .on("mouseout", function (d) {
        if (!mousedown_node || d === mousedown_node) return;
        // unenlarge target node
        d3.select(this).attr("transform", "");
      })
      .on("mousedown", function (d) {
        if (d3.event.ctrlKey) return;
        // select node
        mousedown_node = d;
        if (mousedown_node === selected_node) selected_node = null;
        else selected_node = mousedown_node;
        selected_link = null;
        // reposition drag line
        drag_line
          .style("marker-end", "url(#end-arrow)")
          .classed("hidden", false)
          .attr(
            "d",
            "M" +
              mousedown_node.x +
              "," +
              mousedown_node.y +
            "L" +
              mousedown_node.x +
              "," +
              mousedown_node.y
          );
        select = d.id;

        d3.select(".context-menu").style("display", "none");

        restart();
      })
      .on("mouseup", function (d) {
        if (!mousedown_node) return;
        // needed by FF
        drag_line.classed("hidden", true).style("marker-end", "");
        // check for drag-to-self
        mouseup_node = d;
        if (mouseup_node === mousedown_node) {
          resetMouseVars();
          return;
        }
        // unenlarge target node
        d3.select(this).attr("transform", "");
        // add link to graph (update if exists)
        // NB: links are strictly source < target; arrows separately specified by booleans
        var source, target, direction;
        if (mousedown_node.id < mouseup_node.id) {
          source = mousedown_node;
          target = mouseup_node;
          direction = "right";
        } else {
          source = mouseup_node;
          target = mousedown_node;
          direction = "left";
        }
        var link;
        link = dataset.links.filter(function (l) {
          return l.source === source && l.target === target;
        })[0];
        if (link) {
          link[direction] = true;
        } else {
          link = { source: source, target: target, left: false, right: false, dependencia: "in" };
          link[direction] = true;
          dataset.links.push(link);
        }
        // select new link
        selected_link = link;
        selected_node = null;
        restart();
      })
      .on("mouseover", function () {})
      .on("dblclick", function (d) {
        startEditing(d, this);
      });
    // show node IDs
    g.append("svg:text")
      .attr("x", 25)
      .attr("y", 20)
      .attr("class", "text")
      .text(function (d) {
        return d.name + " Id:" + d.id;
      });
    // show node IDs
    g.append("svg:circle")
      .attr("class", "close")
      .attr("x", 110)
      .attr("y", -10)
      .attr("width", 20)
      .attr("height", 20)
      .attr("r", 10)
      .attr("rx", 10)
      .attr("ry", 10)
      .html('<i class="fa fa-plus"></i>')
      .on("click", function removeNode(d, i) {
        d3.select(this.parentNode).remove();
        d3.select(this.parentNode)
        dataset.nodes.forEach((e) => {
          if (e.id == d.id) {
            dataset.nodes.splice(e, 1);
          }
        });
        var cont = 0;
        dataset.links.forEach((e) => {
          if (e.source.id == d.id || e.target.id == d.id) {
            dataset.links.splice(e, 1);
          }
        });
        restart();
      });
    // remove old nodes
    rect.exit().remove();
    // set the graph in motion
    force.start();
  }
}

function startEditing(d, node) {
  // create a div covering the node then display the form
  d3.selectAll(".context-input")
    .data([1])
    .enter()
    .append("div")
    .append("input")
    .attr("type", "text")
    .attr("class", "context-input")
    .style("left", d3.event.pageX - 2 + "px")
    .style("top", d3.event.pageY - 2 + "px")
    .style("display", "block");
}

function addNode() {
  svg.classed("active", true);
  var idNode = 0;
  dataset.nodes.forEach((e) => {
    idNode = dataset.nodes.length <= e.id ? e.id + 1 : dataset.nodes.length;
  });
  var node = { id: idNode, reflexive: false };
  node.x = 0;
  node.y = 0;
  dataset.nodes.push(node);
  restart();
}

function mousemove() {
  if (!mousedown_node) return;
  // update drag line
  drag_line.attr(
    "d",
    "M" +
      mousedown_node.x +
      "," +
      mousedown_node.y +
      "L" +
      d3.mouse(this)[0] +
      "," +
      d3.mouse(this)[1]
  );
}

function mouseup() {
  if (mousedown_node) {
    // hide drag line
    drag_line.classed("hidden", true).style("marker-end", "");
  }
  // because :active only works in WebKit?
  svg.classed("active", false);
  // clear mouse event vars
  resetMouseVars();
}

var lastKeyDown = -1;

function keydown() {
  d3.event.preventDefault();
  if (lastKeyDown !== -1) return;
  lastKeyDown = d3.event.keyCode;
  // ctrl
  if (d3.event.keyCode === 17) {
    rect.call(force.drag);
    svg.classed("ctrl", true);
  }
  if (!selected_node && !selected_link) return;
  switch (d3.event.keyCode) {
    case 8: // backspace
    case 46: // delete
      if (selected_node) {
        dataset.nodes.splice(dataset.nodes.indexOf(selected_node), 1);
        // spliceLinksForNode(selected_node);
      } else if (selected_link) {
        dataset.links.splice(dataset.links.indexOf(selected_link), 1);
      }
      selected_link = null;
      selected_node = null;
      restart();
      break;
    case 66: // B
      if (selected_link) {
        // set link direction to both left and right
        selected_link.left = true;
        selected_link.right = true;
      }
      restart();
      break;
    case 76: // L
      if (selected_link) {
        // set link direction to left only
        selected_link.left = true;
        selected_link.right = false;
      }
      restart();
      break;
    case 82: // R
      if (selected_node) {
        // toggle node reflexivity
        selected_node.reflexive = !selected_node.reflexive;
      } else if (selected_link) {
        // set link direction to right only
        selected_link.left = false;
        selected_link.right = true;
      }
      restart();
      break;
  }
}

function keyup() {
  lastKeyDown = -1;
  // ctrl
  if (d3.event.keyCode === 17) {
    rect.on("mousedown.drag", null).on("touchstart.drag", null);
    svg.classed("ctrl", false);
    svg.classed("ctrl", false);
  }
}

function closeNode() {
  console.log("close node ", this);
}
// app starts here
svg.on("mousemove", mousemove).on("mouseup", mouseup);
d3.select(window).on("keydown", keydown).on("keyup", keyup);
restart();

async function Save() {
  let validate = await validation();
  if (validate == true) {
    alert("hay nodos sin relacionar ovincular")
  }else{
    //Data Construction to send data
    var nodesData = [];
    var linksData = [];
    dataset.nodes.forEach((element) => {
      var dependency = 1;
      if (element.dependencia != null) {
        if (element.dependencia == "all") dependency = 0;
      }
      var initial = false;
      if (element.inicio != null) {
        if ((element.inicio = 1)) initial = true;
      }
      var final = false;
      if (element.final != null) {
        if ((element.final = 1)) final = true;
      }
      nodesData.push({ designerId: element.id, dependency, initial, final });
    });
    dataset.links.forEach((element) => {
      if (element.right) {
        linksData.push({ source: element.source.id, target: element.target.id });
      }
      if (element.left) {
        linksData.push({ source: element.target.id, target: element.source.id });
      }
    });
    let data = { name: "prueba", nodes: nodesData, links: linksData };
    alert("workflow almacenado")
  }
}

async function validation() {
  let arr1=[]
  let arr2=[]
  dataset.nodes.forEach((e) => {
    dataset.links.forEach((e2 => {
      if (e.id == e2.target.id || e.id == e2.source.id){
        arr2.push(true);
      }else{
        arr2.push(false);
      }
    }));
    arr1.push(arr2.find(el => el == true) ? true : false);
    arr2.length=0;
  });
  return arr1.includes(false);
};


async function postData(url, data) {
  let response = await axios.post(url, data);
}