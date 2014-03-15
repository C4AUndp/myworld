var networkFileLocation = "assets/data/network.csv";


var colorStroke = d3.scale.linear()
.domain([0, 0.41])
.range(["red", "yellow"]);

var colorNode = d3.scale.linear()
.domain([5, 0])
.range(["yellow", "red"]);


var r = d3.scale.linear()
.domain([0, 0.5])
.range([5, 1]);    


var svg = d3.select("#myw-network").append("svg");

var force = d3.layout.force()
.charge(-1000)
// .gravity(2)
.linkDistance(150);
var country = [];
var	links = [];

var gradient = svg.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%")
    .attr("spreadMethod", "pad");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", colorStroke.range()[0])
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "80%")
    .attr("stop-color", colorStroke.range()[1])
    .attr("stop-opacity", 1);

svg.append("svg:text")
  .attr("x", 0)
  .attr("dy", "1em")
  .attr("class", "nodeText")
  .text("More Similar");

svg.append("svg:text")
  .attr("x", 120)
  .attr("dy", "1em")
  .attr("class", "nodeText")
  .text("Less Similar");

  svg.append("svg:rect")
    .attr("y", 15)
    .attr("x", 0)
    .attr("width", 180)
    .attr("height", 10)
    .style("fill", "url(#gradient)");

d3.csv(networkFileLocation, function(rows) {

	rows.forEach(function(d, i){
		country.push({name: d['Country'], cid: i})
	})

	rows.forEach(function(d,i){ 
		country.forEach(function(l){ 
			links.push({source: i, target: l.cid, value: d[l.name]})
		})
	})

  renderNetwork();
});


function renderNetwork() {
var radius = d3.scale.sqrt()
    .range([0, 6]);

 links = links.filter(function(d, i) { return d.value < 0.41; });

 force
 .nodes(country)
 .links(links)
 .linkDistance(function(d) {  return d.source.weight + d.target.weight + 100; 
 })
 .on("tick", tick)
 .start();


 colorNode.domain(d3.extent(force.nodes(), function(d){return d.weight}))

 var link = svg.selectAll(".link")
 .data(force.links())
 .enter().append("line")
 .attr("class", "link")
 .style("stroke", function(d) { return colorStroke(d.value) })
 .style("stroke-width", function(d) { return r(d.value) });


 var node = svg.selectAll(".node")
 .data(force.nodes())
 .enter().append("g")
 .filter(function(d, i) { return d.weight > 2; })
 .attr("class", "node")
 .on("mouseover", function(d){mouseover(d)})
 .on("mouseout", mouseout)
 .call(force.drag);

 node.append("circle")
 .attr("r", function(d) { return d.weight })
 .style("fill", function(d) { return colorNode(d.weight) })
 .style("opacity", .8);

 node.append("text")
 .attr("x", 12)
 .attr("dy", ".35em")
 .attr("class", "nodeText")
 .text(function(d) { return d.name; });



 resize();
 d3.select(window).on("resize", resize);

 function tick() {
  link.attr("x1", function(d) { return d.source.x; })
  .attr("y1", function(d) { return d.source.y; })
  .attr("x2", function(d) { return d.target.x; })
  .attr("y2", function(d) { return d.target.y; });

  node
  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function resize() {
  var elem = $("#myw-network")

  var marginW = elem.innerWidth()/5;
  var marginH = elem.innerHeight()/5;

  widthF = elem.innerWidth()-marginW, heightF = elem.innerHeight()-marginH;
  svg.attr("width", widthF).attr("height", heightF);
  force.size([widthF, heightF]).resume();
}

function mouseover(s) {

  d3.selectAll("circle")  
    .filter(function(d){ return d === s })
    .style("fill", "#333")    

  d3.selectAll(".link")
    .filter(function(d){
      return d.source === s || d.target === s;
    })
    .style("stroke", "#333")

}

function mouseout() {
    d3.selectAll(".link")
     .style("stroke", function(d) { return colorStroke(d.value) })

     d3.selectAll("circle")  
      .style("fill", function(d) { return colorNode(d.weight) })


    }

  }
