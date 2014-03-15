var api = "http://54.227.246.164/stats/public/";
api = api+ "segment?&country=";

var topCountries = [
  api + "9",
  api + "16",
  api + "24",
  api + "30",
  api + "31",
  api + "36",
  api + "47",
  api + "53",
  api + "61",
  api + "65",
  api + "66",
  api + "77",
  api + "78",
  api + "83",
  api + "88",
  api + "96",
  api + "110",
  api + "125",
  api + "134",
  api + "136",
  api + "151",
  api + "159",
  api + "161",
  api + "170",
  api + "177",
  api + "181",
  api + "183",
  api + "185",
  api + "193"
]

queue()
    .defer(request, topCountries[0])
    .defer(request, topCountries[1])
    .defer(request, topCountries[2])
    .defer(request, topCountries[3])
    .defer(request, topCountries[4])
    .defer(request, topCountries[5])
    .defer(request, topCountries[6])
    .defer(request, topCountries[7])
    .defer(request, topCountries[8])
    .defer(request, topCountries[9])
    .defer(request, topCountries[10])
    .defer(request, topCountries[11])
    .defer(request, topCountries[12])
    .defer(request, topCountries[13])
    .defer(request, topCountries[14])
    .defer(request, topCountries[15])
    .defer(request, topCountries[16])
    .defer(request, topCountries[17])
    .defer(request, topCountries[18])
    .defer(request, topCountries[19])
    .defer(request, topCountries[20])
    .defer(request, topCountries[21])
    .defer(request, topCountries[22])
    .defer(request, topCountries[23])
    .defer(request, topCountries[24])
    .defer(request, topCountries[25])
    .defer(request, topCountries[26])
    .defer(request, topCountries[27])
    .defer(request, topCountries[28])
    .await(ready);

function request(url, callback) {
  var req = new XMLHttpRequest;
  req.open("GET", url, true);
  req.setRequestHeader("Accept", "application/json");
  req.onreadystatechange = function() {
    if (req.readyState === 4) {
      if (req.status < 300) callback(null, JSON.parse(req.responseText));
      else callback(req.status);
    }
  };
  req.send(null);
}
//  ----------------------------- 

function ready(error, c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c27, c28, c29) {
  

  var countries = [
      {name: "Australia", values:c1},
      {name: "Belarus", values:c2},
      {name: "Brazil", values:c3},
      {name: "Cameroon", values:c4},
      {name: "Canada", values:c5},
      {name: "China", values:c6},
      {name: "Democratic Republic of the Congo", values:c7},
      {name: "Egypt", values:c8},
      {name: "France", values:c9},
      {name: "Germany", values:c10},
      {name: "Ghana", values:c11},
      {name: "India", values:c12},
      {name: "Indonesia", values:c13},
      {name: "Italy", values:c14},
      {name: "Kenya", values:c15},
      {name: "Liberia", values:c16},
      {name: "Mexico", values:c17},
      {name: "Nigeria", values:c18},
      {name: "Philippines", values:c19},
      {name: "Portugal", values:c20},
      {name: "Serbia", values:c21},
      {name: "South Africa", values:c22},
      {name: "Spain", values:c23},
      {name: "Thailand", values:c24},
      {name: "Turkey", values:c25},
      {name: "Ukraine", values:c26},
      {name: "United Kingdom of Great Britain and Northern Ireland", values:c27},
      {name: "United States of America", values:c28},
      {name: "Zimbabwe", values:c29}
  ]

  multiples(countries)
  // console.log(countries)
}  


var margin = {top: 30, right: 0, bottom: 15, left: 30},
    width = 250 - margin.left - margin.right,
    height = 150 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");
// var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, 250], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(4)
    .tickFormat(formatPercent);


function multiples (data) {

  data.forEach(function(d){
    d.values.rankings.forEach(function(z){
      z.norm = z.count/d.values.tVotes;
    })
    d.values.rankings.sort(function(z) { return z.id; })
  });

  // console.log(data)

  x.domain(data.map(function(d) { 
    return d.values.rankings.map( function(z) { return z.id; } ) 
  }));

  y.domain([0, 1]);


  console.log(x.domain())

  var gBar = d3.select("#rankings").selectAll(".chartg")
      .data(data)
    .enter().append("svg")
      .attr("class", "chartg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


      //   gBar.append("g")
      // .attr("class", "x axis")
      // .attr("transform", "translate(0," + height + ")")
      // .call(xAxis);

  gBar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      // .text("Frequency");


  gBar.append("text")
  .attr("x", 10)
  .attr("dy", "1em")
  .attr("class", "countryName")
  // .style("text-anchor", "middle")
  .text(function(d) { return d.name; });
    

    var mBar = gBar.selectAll(".bars")
      .data(function(d) { return d.values.rankings; })
    .enter().append("g")
      .attr("class", "bars")
       .on("mouseover", function(d){mouseover(d)})
     .on("mouseout", mouseout)




      mBar.append("rect")
      .attr("class", function(d) { return "pri pri" + d.id; })
      .attr("x", function(d) { return x(d.id); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.norm); })
      .attr("height", function(d) { return height - y(d.norm); });

      mBar.append("text")
      .attr("class", function(d) { return "pritext pritext" + d.id; })
      .attr("x", function(d) { return x(d.id); })
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("opacity", 0)
      .attr("y", function(d) { return y(0); })
      .text(function(d) { return formatPercent(d.norm); });
      // .attr("height", function(d) { return height - y(d.norm); });


function mouseover(s) {
  // console.log(s);

  d3.selectAll(".pritext") 
    .style("opacity", 0)  

d3.selectAll(".pritext"+s.id) 
    .style("opacity", 1)

  d3.selectAll(".pri") 
    .style("fill", "#999")    

  d3.selectAll(".pri"+s.id)
    .style("fill", "orange")    

}

function mouseout() {
    

    }

}

