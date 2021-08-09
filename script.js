const treeData = [
  {
    name: "Start",
    parent: "null",
  },
];

$(document).ready(function () {
  const margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120,
    },
    width = 1260 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

  var i = 0,
    duration = 750,
    root;

  const tree = d3.layout.tree().size([height, width]);

  const diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.y, d.x];
  });

  const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(50,50)");

  makeTree();
});

function makeTree() {
  // ************** Generate the tree diagram  *****************
  const margin = {
      top: 20,
      right: 120,
      bottom: 20,
      left: 120,
    },
    width = 1260 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

  var i = 0,
    duration = 750,
    root;

  const tree = d3.layout.tree().size([height, width]);

  const diagonal = d3.svg.diagonal().projection(function (d) {
    return [d.y, d.x];
  });

  const svg = d3
    .select("svg")
    .append("g")
    .attr("transform", "translate(-421,0)");

  root = treeData[0];
  oldlx = root.x0 = 50;
  oldly = root.y0 = width;

  update(root);

  function update(source) {
    // Compute the new tree layout.
    const nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) {
      d.y = width - d.depth * 180;
    });

    // Update the nodes…
    const node = svg.selectAll("g.node").data(nodes, function (d) {
      return d.id || (d.id = ++i);
    });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node
      .enter()
      .append("g")
      .attr("class", function (d) {
        return "node"; //all nodes with parent will have this class
      })
      .attr("transform", function (d) {
        return "translate(" + source.y0 + "," + source.x0 + ")";
      })
      .on("click", click);

    nodeEnter
      .append("rect")
      .attr("x", "-10")
      .attr("y", "-15")
      .attr("height", 30)
      .attr("width", 100)
      .attr("rx", 15)
      .attr("ry", 15)
      .style("fill", "#f1f1f1");

    nodeEnter
      .append("text")
      .attr("x", function (d) {
        return -5;
      })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.name;
      })
      .style("fill-opacity", 1e-6);

    const addChild = nodeEnter.append("g");

    addChild
      .append("rect")
      .attr("x", "30")
      .attr("y", "10")
      .attr("height", 20)
      .attr("width", 20)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("stroke", "#444")
      .style("stroke-width", "2")
      .style("fill", "#ccc");

    addChild
      .append("svg:foreignObject")
      .attr("x", "33.4")
      .attr("y", "8.6")
      .attr("height", 20)
      .attr("width", 20)
      .html('<i class="fa fa-plus"></i>');

    // Transition nodes to their new position.
    const nodeUpdate = node
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        if (d.parent == "null") {
          d.y = oldly;
          d.x = oldlx;
        }
        return "translate(" + d.y + "," + d.x + ")";
      });

    nodeUpdate
      .select("circle")
      .attr("r", 10)
      .style("fill", function (d) {
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeUpdate.select("text").style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node
      .exit()
      .transition()
      .duration(duration)
      .attr("transform", function (d) {
        return "translate(" + source.y + "," + source.x + ")";
      })
      .remove();

    nodeExit.select("circle").attr("r", 1e-6);

    nodeExit.select("text").style("fill-opacity", 1e-6);

    // Update the links…
    const link = svg.selectAll("path.link").data(links, function (d) {
      return d.target.id;
    });

    // Enter any new links at the parent's previous position.
    link
      .enter()
      .insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        //var o = {
        //    x: source.x0,
        //    y: source.y0
        //};
        //return diagonal({
        //    source: o,
        //    target: o
        //});
        return (
          "M" +
          d.source.x +
          "," +
          d.source.y +
          " C " +
          d.source.x +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          (d.source.y + d.target.y) / 2 +
          " " +
          d.target.x +
          "," +
          d.target.y
        );
      })
      .on("click", removelink);

    function removelink(d) {
      //this is the links target node which you want to remove
      const target = d.target;
      //make new set of children
      const children = [];
      //iterate through the children
      target.parent.children.forEach(function (child) {
        if (child.id != target.id) {
          //add to teh child list if target id is not same
          //so that the node target is removed.
          children.push(child);
        }
      });
      //set the target parent with new set of children sans the one which is removed
      target.parent.children = children;
      //redraw the parent since one of its children is removed
      update(d.target.parent);
    }

    // Transition links to their new position.
    link.transition().duration(duration).attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link
      .exit()
      .transition()
      .duration(duration)
      .attr("d", function (d) {
        const o = {
          x: source.x,
          y: source.y,
        };
        return diagonal({
          source: o,
          target: o,
        });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    addChild.on("click", function (d) {
      event.stopPropagation();
      $("#child-info").show();
      $("#child-text").val("");

      $("#btn-add-child").off("click");
      $("#btn-add-child").click(function () {
        const childname = $("#child-text").val();

        if (typeof d.children === "undefined") {
          const newChild = [
            {
              name: childname,
              parent: "Son Of A",
            },
          ];

          console.log(tree.nodes(newChild[0]));
          const newnodes = tree.nodes(newChild);
          d.children = newnodes[0];
          console.log(d.children);
          update(d);
        } else {
          const newChild = {
            name: childname,
            parent: "Son Of A",
          };

          console.log(d.children);
          d.children.push(newChild);
          console.log(d.children);
          update(d);
        }

        $("#child-info").hide();
      });
    });
  }

  // Toggle children on click.
  function click(d) {
    // console.log(d);
    // if (d.children) {
    //  d._children = d.children;
    //  d.children = null;
    // } else {
    //  d.children = d._children;
    //  d._children = null;
    // }
    // update(d);
  }
}
