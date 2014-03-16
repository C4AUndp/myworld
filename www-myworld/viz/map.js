var stats =[];
var people = 0;

var m = [0, 0, 0, 0],
    w = 884 - m[1] - m[3],
    h = 500 - m[0] - m[2],
    w2 = 428 - m[1] - m[3],
    h2 = 255 - m[0] - m[2];

var colors = [d3.rgb(253,253,253).toString(),d3.rgb(242,245,212).toString(),d3.rgb(234,238,173).toString(),d3.rgb(228,232,135).toString(),d3.rgb(221,228,89).toString(),d3.rgb(215,223,33).toString()]  


// Mercator Projection Settings

var projection = d3.geo.mercator()
        .scale([720])
        .translate([w/2,h/2+90]);

var projectionSmall = d3.geo.mercator()
        .scale([390])
        .translate([w2/2,h2/2+55]);

var path = d3.geo.path()
    .projection(projection);

var pathSmall = d3.geo.path()
    .projection(projectionSmall);

var map = d3.select("#viz").append("svg:svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
          .attr("pointer-events", "all")
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
          .style("stroke", "#bbb");


var mapSmall = d3.select("#viz-small").append("svg:svg")
          .attr("width", w2 + m[1] + m[3])
          .attr("height", h2 + m[0] + m[2])
          .attr("pointer-events", "all")
        .append("svg:g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
          .style("stroke", "#bbb");


// Language JSON for future implementations
// d3.json("assets/langs/default.json", function(error, stats) { 
//   var cnames = stats.fields_values.countries;
//   main.forEach(function(d,i){
//       // console.log(d.id+","+d.name)
//   })
// })


var xhr = d3.json("viz/world.json")
    .on("progress", function() { //console.log("progress", d3.event.loaded); 
    })
    .on("load", function(world) { 
        var xhr2 = d3.json("http://votes2.myworld2015.org/stats.json")
        .on("load", function(stats) { 
          stats = stats;

          stats.forEach(function(d){
            people+=d.count;
          })
          
      
    
    var countries = topojson.object(world, world.objects.countries).geometries,
        i = -1,
        n = countries.length;

    var country = map.selectAll(".country")
        .data(countries)
      .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", path);

    var countrySmall = mapSmall.selectAll(".country")
        .data(countries)
      .enter().insert("path", ".graticule")
        .attr("class", "country")
        .attr("d", pathSmall);

    country
      .style("fill", function(d){ 
        var c = getVotes(parseInt(d.id), stats); 
        if (c>1000000) {return colors[5]}
        if (c>100000) {return colors[4]}
        if (c>10000) {return colors[3]}
        if (c>100) {return colors[2]}
        if (c>0){return colors[1]}
        else {return colors[0]}  
      })
      .call(d3.helper.tooltip(function(d, i){
          if (d.id) {
            return "<span class='b'>" + d.name + "</span><br>" + getVotes(parseInt(d.id), stats) +  " votes";
          };
      }));

    countrySmall
      .style("fill", function(d){ 
        var c = getVotes(parseInt(d.id), stats); 
        if (c>1000000) {return colors[5]}
        if (c>100000) {return colors[4]}
        if (c>10000) {return colors[3]}
        if (c>100) {return colors[2]}
        if (c>0){return colors[1]}
        else {return colors[0]}  
      })
      .call(d3.helper.tooltip(function(d, i){
        if (d.id) {
          return "<span class='b'>" + d.name + "</span><br>" + getVotes(parseInt(d.id), stats) +  " votes";}
      }));

    country.filter(function(d){ return d.name=="Antarctica"}).remove();
    countrySmall.filter(function(d){ return d.name=="Antarctica"}).remove();



    var countryCholder = $("#cnumber, #cnumber-header, #cnumber-small");
    var countryC = (stats.length).toString().split('');

    var peopleCholder = $("#pnumber-header");
    var peopleC = people.toString().split('');

    var pc = 0;
    var pm = 10-peopleC.length; 

    for (var i=0; i<13; i++){
      if (i==1 || i==5 || i==9) {
        peopleCholder.append('&nbsp;');
      }
      else if ((pc-pm)>-1){
        peopleCholder.append($('<span class="count" id="peopleC'+i+'">'+peopleC[pc-pm]+'</span>'));
        pc++;
      }
      else {
        peopleCholder.append($('<span class="count" id="peopleC'+i+'">&nbsp;</span>'));
        pc++;
      }
    }

    $.each(countryC, function(index, item){
      countryCholder.append($('<span class="count">'+item+'</span>'));
    });
  
  // d3.selectAll("#pnumber-header").html(
  //     "<span class='count'>" + String(people).substring(0,1) + 
  //     "</span><span class='count'>" + String(people).substring(1,2) + 
  //     "</span><span class='count'>" + String(people).substring(2,3) + 
  //     "</span>")

  // d3.selectAll("#cnumber, #cnumber-header, #cnumber-small").html(
  //     "<span class='count'>" + String(stats.length).substring(0,1) + 
  //     "</span><span class='count'>" + String(stats.length).substring(1,2) + 
  //     "</span><span class='count'>" + String(stats.length).substring(2,3) + 
  //     "</span>")

        })
        // .on("error", function(error) { console.log("failure!", error); })
        .get();

     })
    // .on("error", function(error) { console.log("failure!", error); })
    .get();


// ADD LEGEND
var legendpad = 145;
var legendtitles = ["0","1 - 100","100 - 10,000","10,000 - 100,000","100,000 - 1,000,000","1,000,000+"]

var legend = d3.select("#viz").append("svg:svg")
      .attr("width", w)
          .attr("height", 20)
          .attr("pointer-events", "all")
        .append("svg:g")
          .attr("transform", "translate(" + 40 + "," + 0 + ")");


var rect = legend.selectAll("rect.legend")
      .data(colors)
    .enter().append("rect")
        .attr("y", 0)
      .attr("x", function (d,i) {return i*legendpad})
      .attr("height", 12)
    .attr("width", 12)
    .style("fill", function (d,i) {return colors[i]})
    .style("stroke", "#ddd");

var texts = legend.selectAll("text.legend")
      .data(legendtitles)
    .enter().append("svg:text")
        .attr("y", 0)
      .attr("x", function (d,i) {return (i*legendpad)+20})
      .attr("dx", 0)
      .attr("dy", 10)
      .text(function (d,i) {return d})
    .style("font-size", "11px")
    .style("fill", "#111");

// ADD LEGEND SMALL
var legendpad2 = 95;
var legendtitles2 = ["1 - 100","100 - 10,000","10,000 - 100K","100K - 1M","1M+"]

var legend2 = d3.select("#viz-small").append("svg:svg")
      .attr("width", w2)
          .attr("height", 30)
          .attr("pointer-events", "all")
        .append("svg:g")
          .attr("transform", "translate(" + 0 + "," + 10 + ")");

var rect2 = legend2.selectAll("rect2.legend")
      .data(legendtitles2)
    .enter().append("rect")
        .attr("y", 0)
      .attr("x", function (d,i) {return i*legendpad2})
      .attr("height", 12)
    .attr("width", 12)
    .style("fill", function (d,i) {return colors[i+1]})
    .style("stroke", "#ddd");

var texts2 = legend2.selectAll("text2.legend")
      .data(legendtitles2)
    .enter().append("svg:text")
        .attr("y", 0)
      .attr("x", function (d,i) {return (i*legendpad2)+15})
      .attr("dx", 0)
      .attr("dy", 10)
      .text(function (d,i) {return d})
    .style("font-size", "10px")
    .style("fill", "#111");




// Get Votes of the Country from the Array of Objects
function getVotes(id, matrix) {
  // console.log(matrix)
  for (var i=0; i<matrix.length; i++) {
      if (matrix[i].country === id) { return matrix[i].count; }
  }
  return 0;
}

// TOOLTIP HELPER
d3.helper = {};

d3.helper.tooltip = function(accessor){
    return function(selection){
        var tooltipDiv;
        var bodyNode = d3.select('body').node();
        selection.on("mouseover", function(d, i){
            // Clean up lost tooltips
            d3.select('body').selectAll('div.svgtooltip').remove();
            // Append tooltip
            tooltipDiv = d3.select('body').append('div').attr('class', 'svgtooltip');
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 15)+'px')
                .style('position', 'absolute') 
                .style('z-index', 999999);
            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';
            // Crop text arbitrarily
            tooltipDiv.style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
                .html(tooltipText);
        })
        .on('mousemove', function(d, i) {
            // Move tooltip
            var absoluteMousePos = d3.mouse(bodyNode);
            tooltipDiv.style('left', (absoluteMousePos[0] + 10)+'px')
                .style('top', (absoluteMousePos[1] - 0)+'px');
            var tooltipText = accessor(d, i) || '';
            tooltipDiv.html(tooltipText);
        })
        .on("mouseout", function(d, i){
            // Remove tooltip
            tooltipDiv.remove();
        });

    };
};