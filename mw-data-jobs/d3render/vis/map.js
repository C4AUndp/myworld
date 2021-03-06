var data,
    countries;

var map,
    m = [0, 0, 0, 0],
    w = 884 - m[1] - m[3],
    h = 500 - m[0] - m[2],
    w2 = 428 - m[1] - m[3],
    h2 = 255 - m[0] - m[2],
    colors = [d3.rgb(253,253,253).toString(),d3.rgb(242,245,212).toString(),d3.rgb(234,238,173).toString(),d3.rgb(228,232,135).toString(),d3.rgb(221,228,89).toString(),d3.rgb(215,223,33).toString()],
    projection = d3.geo.mercator()
          .scale([720])
          .translate([w/2,h/2+90]),
    path = d3.geo.path()
      .projection(projection);

function setup() {

  d3.select("#vis").remove();

  map = d3.select("body").append("svg:svg")
          .attr("id", "vis")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
          .attr("pointer-events", "all")
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
          .style("stroke", "#bbb");

}

function update(d) {

  // update the data
  data = d;
  countries = topojson.object(data, data.objects.countries).geometries;

  var i = -1,
      n = countries.length;


  // redraw countries
  var country = map.selectAll(".country")
      .data(countries)
    .enter().insert("path", ".graticule")
      .attr("class", "country")
      .attr("id", function(d) { return "country-"+d.id; })
      .attr("d", path);

  country
    .style("fill", function(d){ 
      var c = getVotes(parseInt(d.id), stats); 
      if (c>1000000) {return colors[5]}
      if (c>100000) {return colors[4]}
      if (c>10000) {return colors[3]}
      if (c>100) {return colors[2]}
      if (c>0){return colors[1]}
      else {return colors[0]}  
    });

  country.filter(function(d){ return d.name=="Antarctica"}).remove();

}

function personalize(params) {

  if (params.country) {
    d3.select("#country-"+params.country).style("fill", "#0000ff");
  }

}

// Get Votes of the Country from the Array of Objects
function getVotes(id, matrix) {
  // console.log(matrix)
  for (var i=0; i<matrix.length; i++) {
      if (matrix[i].country === id) { return matrix[i].count; }
  }
  return 0;
}