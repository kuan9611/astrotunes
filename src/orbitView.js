var d3 = require('d3');
var node = document.createElement('div');

// establish variables
var w     = 960;
var h     = 500;
var x     = (w/2);
var y     = (h/2);
var t0    = new Date().setHours(0,0,0,0);
var delta = (Date.now() - t0);

var planets = [
  { R:  13, r:  1, speed: -1.60, phi0: 0},
  { R:  23, r:  2, speed: -1.17, phi0: 0},
  { R:  44, r:  2, speed: -1.00, phi0: 0},
  { R:  70, r:  1, speed: -0.80, phi0: 0},
  { R: 145, r: 22, speed: -0.43, phi0: 0},
  { R: 292, r: 18, speed: -0.32, phi0: 0},
];

// insert svg element
var svg = d3.select(node).insert("svg")
    .attr("width", w)
    .attr("height", h);

// sun
svg.append("circle")
   .attr("r", 10)
   .attr("cx", x)
   .attr("cy", y)
   .attr("id", "sun");

// planet group
var container = svg.append("g")
    .attr("id", "orbit_container")
    .attr("transform", "translate(" + x + "," + y + ")");

// draw planets
container.selectAll("g.planet").data(planets).enter().append("g")
         .attr("class", "planet_cluster").each(function(d, i) {
           d3.select(this).append("circle").attr("class", "orbit")
             .attr("r", d.R);
           d3.select(this).append("circle").attr("r", d.r).attr("cx",d.R)
             .attr("cy", 0).attr("class", "planet");
         })

// throttled rotation animations
setInterval(function(){
  var delta = (Date.now() - t0);
  svg.selectAll(".planet_cluster").attr("transform", function(d) {
    return "rotate(" + (d.phi0 + (delta * (d.speed/100))) + ")";
  });
}, 40);

module.exports = node;
