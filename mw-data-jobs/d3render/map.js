var data,
    countries,
    map;

var m = [0, 0, 0, 0],
    w = 884 - m[1] - m[3],
    h = 500 - m[0] - m[2],
    w2 = 428 - m[1] - m[3],
    h2 = 255 - m[0] - m[2],
    // colors = [d3.rgb(253,253,253).toString(),d3.rgb(242,245,212).toString(),d3.rgb(234,238,173).toString(),d3.rgb(228,232,135).toString(),d3.rgb(221,228,89).toString(),d3.rgb(215,223,33).toString()],
    colorFill = d3.scale.sqrt()
      .range(["#FFFFFF", "#C7D8E5", "#2469AE"])
      .clamp(true),
    projection = d3.geo.eckert3()
        .scale([175])
        .translate([w/2,h/2+40]),
    path = d3.geo.path()
      .projection(projection);

var coma = d3.format(",f");

function update(d) {

  data = d;

  // process data
  var statsMap = d3.map();
  data.stats.countries.forEach(function(d) {
    statsMap.set(d.country, d.tVotes);
  });

  var maxVotes = d3.max(data.stats.countries, function(d){ return d.tVotes});
  maxVotes = roundTo(maxVotes, 10000);
  colorFill.domain([0 , 100, maxVotes]);

  var eDate = new Date(data.stats.computed_at*1000);

  d3.selectAll("#vis").remove(); // remove old one
  
  map = d3.select("body").append("svg")
          .attr("id", "vis")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
          .attr("pointer-events", "all")
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
          .style("stroke", "#bbb");

  map.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
    .attr("fill", "#ffffff")
    .attr("stroke", "none");

  // update the data
  data = d;
  countries = topojson.object(data.world, data.world.objects.countries).geometries;

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
      var c = statsMap.get(d.id);
      if (!c) c = 0;      
      // if (c>1000000) {return colors[5]}
      // if (c>100000) {return colors[4]}
      // if (c>10000) {return colors[3]}
      // if (c>100) {return colors[2]}
      // if (c>0){return colors[1]}
      // else {return colors[0]}
      return colorFill(c);
    });

  country.filter(function(d){ return d.name=="Antarctica"}).remove();


// Visualization Header
  map.append("text")
    .attr("y", 0)    
    .attr("x", 0)
    .attr("dy", 25)
    .style("text-anchor", "start")
    .style("font-size", "32px")
    .style("font-weight", "bold")
    .style("fill", "#111")
    .text(data.lang.viz[ 'viz2_title_results' ]);

  // map.append("text")
  //   .attr("x", 0)
  //   .attr("y", 0)
  //   .attr("dy", 55)
  //   .style("text-anchor", "start")
  //   .style("font-size", "24px")
  //   .style("fill", "#666")
  //   .text(data.lang.viz[ 'viz2_subtitle' ]);  

  map.append("text")
    .attr("x", w)
    .attr("y", h)
    .attr("dy", -5)
    .style("text-anchor", "end")
    .style("font-size", "11px")
    .style("fill", "#666")
    .text(data.lang.viz[ 'country_totals' ] +  eDate);

// Map Legend
var legendpad = 20; // Legend Padding
var legendsize = 16; // Legend Box Size

var legend = map.selectAll(".legend")
    .data(colorFill.domain())
    .enter().append("g")
    .attr("transform", "translate(" + legendpad + "," + (h-legendpad*4) + ")")

    legend.append("rect")
      .attr("y", function (d,i) {return i*legendpad})
      .attr("x", 0)
      .attr("height", legendsize)
      .attr("width", legendsize)
      .style("fill", function (d,i) {return colorFill(d)})
      .style("stroke", "#ddd");

    legend.append("text")
      .attr("y", function (d,i) {return i*legendpad})
      .attr("x", 0)
      .attr("dx", legendsize+4)
      .attr("dy", 14)
      .text(function (d,i) {
          if (d == 0) {return data.lang.viz['none']}
          return "~" + coma(d);
          })
      .style("font-size", "12px")
      .style("fill", "#111");



}


function roundTo(number, to) {
  return Math.round(number / to) * to;
}

function personalize(params) {

  d3.selectAll(".country").classed("highlight", false);

  if (params.country) {
    d3.select("#country-"+params.country).classed("highlight", true);
  }

}