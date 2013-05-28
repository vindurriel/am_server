var w = 1280,
  h = 800,
  node,
  link,
  root,
  force;

var ctrlPressed = false;
var shiftPressed = false;
Array.prototype.remove = function(b) {
  var a = this.indexOf(b);
  if (a >= 0) {
    this.splice(a, 1);
    return true;
  }
  return false;
};
function cacheIt(e) {
  ctrlPressed = e.ctrlKey;
  shiftPressed = e.shiftKey;
}
document.onkeydown = cacheIt;
document.onkeyup = cacheIt;

var vis = d3.select("body").insert("svg:svg","#tip")
  .attr("width", w)
  .attr("height", h)
  .attr("pointer-events", "all")
  .append('svg:g')
  .call(d3.behavior.zoom().on("zoom", redraw))
  .append('svg:g');

vis.append('svg:rect')
  .attr('width', w)
  .attr('height', h)
  .attr('fill', 'none');

function redraw() {
  console.log("here", d3.event.translate, d3.event.scale);
  vis.attr("transform",
    "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
}
var draw = function(json) {
  root = json;
  root.fixed = true;
  root.x = w / 2;
  root.y = h / 2 - 80;
  force = d3.layout.force()
    .on("tick", tick)
    .charge(function(d) {
    return d._children ? -d.size / 50 : -80;
  })
    .linkDistance(function(d) {
    return d.target._children ? 100 : 50;
  })
    .size([w, h - 160]);
  update();
};


function update() {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;
  var nodes = flatten(root),
    links = d3.layout.tree().links(nodes);

  // Restart the force layout.
  force.stop();
  force
    .nodes(nodes)
    .links(links)
    .start();

  // Update the links…
  link = vis.selectAll(".link")
    .data(links, function(d) {
    return d.target.id;
  });

  // Enter any new links.
  link.enter().insert("line", ".node")
    .attr("class", "link")
    .attr("x1", function(d) {
    return d.source.x;
  })
    .attr("y1", function(d) {
    return d.source.y;
  })
    .attr("x2", function(d) {
    return d.target.x;
  })
    .attr("y2", function(d) {
    return d.target.y;
  });

  // Exit any old links.
  link.exit().remove();



  // Update the nodes…
  node = vis.selectAll(".node")
    .data(nodes, function(d) {
    return d.id;
  })
    .style("stroke-width", stroke_width)
    .style("fill", color);



  node.transition()
    .attr("r", getR);

  // Enter any new nodes.
  node.enter().append("svg:circle")
    .attr("class", "node")
    .attr("cx", function(d) {
    return d.x;
  })
    .attr("cy", function(d) {
    return d.y;
  })
    .attr("r", getR)
    .style("fill", color)
    .style("stroke-width", stroke_width)
    .on("click", click)
    .call(force.drag);

  node.append("title")
    .text(function(d) {
    return d.name;
  });
  // Exit any old nodes.

  node.exit().remove();



}

function getR(d) {
  var x = d.level;
  if (x > 4) x = 4;
  return 15 - x * 3;

}

function tick() {

  link.attr("x1", function(d) {
    return d.source.x;
  })
    .attr("y1", function(d) {
    return d.source.y;
  })
    .attr("x2", function(d) {
    return d.target.x;
  })
    .attr("y2", function(d) {
    return d.target.y;
  });

  node.attr("cx", function(d) {
    return d.x;
  })
    .attr("cy", function(d) {
    return d.y;
  });
}

// Color leaf nodes orange, and packages white or blue.
colors = ["#000088", "#4678a4", "#53b1e3", "#ade2e6", "#aaaaff"];

function color(d) {
  return colors[d.level % 5];
  // return d._children ? "#ff0000" : d.children ? "#000000" : "#aaddff";
}

function stroke_width(d) {
  return d._children ? "2px" : ".5px";
}
// Toggle children on click.

function click(d) {
  if (ctrlPressed) {
    if (!d.children) d.children = []
    d.children.push({
      name: "new node",
      size: 1
    });
  } else if (shiftPressed) {
    if (d.parent) {
      d.parent.children.remove(d);
    }
  } else {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
  }
  update();
}

// Returns a list of all nodes under the root.

function flatten(root) {
  var nodes = [],
    i = 0;

  function recurse(node, level, parent) {
    node.level = level;
    node.parent = parent;
    if (node.children)
      node.size = node.children.reduce(function(p, v) {
        return p + recurse(v, level + 1, node);
      }, 0);
    // if (!node.id) 
    node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root, 0, null);
  return nodes;
}

d3.json("/javascripts/flare.json", draw);