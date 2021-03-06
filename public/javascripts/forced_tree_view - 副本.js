var w = 1280,
    h = 800,
  node,
  link,
  root;
var force = d3.layout.force()
  .on("tick", tick)
  .charge(function(d) {return d._children ? -d.size / 100 : -30;})
  .linkDistance(function(d) {
  return d.target._children ? 80 : 30;
})
  .size([w, h - 160]);

var diag=d3.svg.diagonal()
    .projection(function(d)
    {
        return [d.y, d.x];
    });

var vis = d3.select("body").append("svg:svg")
  .attr("width", w)
  .attr("height", h);

d3.json("/javascripts/flare.json", function(json) {
  root = json;
  root.fixed = true;
  root.x = w / 2;
  root.y = h / 2 - 80;
  update();
});

function update() {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;
  var nodes = flatten(root),
    links = d3.layout.tree().links(nodes);

  // Restart the force layout.
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
  link.enter().append("line")
    .attr("class", "link")
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  // Exit any old links.
  link.exit().remove();


  
  // Update the nodes…
  node = vis.selectAll(".node")
    .data(nodes, function(d) {
    return d.id;
  })
    .style("fill", color);

 

  node.transition()
    .attr("r", function(d) {
    return d.children ? 4 : Math.sqrt(d.size) / 10;
  });

  // Enter any new nodes.
  node.enter().append("svg:circle")
    .attr("class", "node")
    .attr("cx", function(d) {
    return d.x;
  })
    .attr("cy", function(d) {
    return d.y;
  })
    .attr("r", function(d) {
    return d.children ? 4 : Math.sqrt(d.size) / 10;
  })
    .style("fill", color)
    .on("click", click)
    .call(force.drag);

  node.append("title")
    .text(function (d){return d.name;});
  // Exit any old nodes.

  node.exit().remove();



}

function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

  node.attr("cx", function(d) {
    return d.x;
  })
    .attr("cy", function(d) {
    return d.y;
  });
}

// Color leaf nodes orange, and packages white or blue.

function color(d) {
  return d._children ? "#ff0000" : d.children ? "#000000" : "#aaddff";
}

// Toggle children on click.

function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update();
}

// Returns a list of all nodes under the root.

function flatten(root) {
  var nodes = [],
    i = 0;

  function recurse(node) {
    if (node.children) node.size = node.children.reduce(function(p, v) {
        return p + recurse(v);
      }, 0);
    if (!node.id) node.id = ++i;
    nodes.push(node);
    return node.size;
  }

  root.size = recurse(root);
  return nodes;
}