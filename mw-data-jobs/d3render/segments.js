// ************************ global variables

var data,
    svg,
    x,
    y,
    png = true;

// ************************ settings

var pad = 0.02,
    padLarge = 0,
    margin = {top: 120, right: 0, bottom: 40, left: 0},
    width = 906 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,
    segmentWidth = 36;

// ************************ draw vis layout

function draw(d) {
  /******

  data example:

  d = {
    mode: "results" | "thankyou",
    lang: { language json file },
    segments: [ segments data array ],
    customSegment: { custom segment data },
    userChoices: [ 1, 2, 3, 4, 5, 6 ],
    userChoices_others: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
    user: {
      country: '183',
      age: '50',
      gender: '1'
    }
  }

  ******/

  data = d;

  // process the data
  data.segments.forEach(function(d) {
    d = processSegmentData(d);
  });

  // scales
  x = d3.scale.ordinal()
      .rangeRoundBands([0, width-496], pad);
  y = d3.scale.linear()
      .range([0, height]);
  x.domain(data.segments.map(function(d) { return d.title; }));
  y.domain([d3.min(data.segments, function(d) { return d3.min(d.values.rankings, function(z) { return z.y0})}), d3.max(data.segments, function(d) { return d3.max(d.values.rankings, function(z) { return z.y0})})])

  var positions = {
    "thankyou": {
      "world": 2,
      "country": 39,
      "male": 81,
      "female": 118,
      "age1": 160,
      "age2": 197,
      "age3": 234,
      "hdi1": 276,
      "hdi2": 313,
      "hdi3": 350,
      "hdi4": 387
    },
    "results": {
      "world": 18,
      "male": 81,
      "female": 118,
      "age1": 160,
      "age2": 197,
      "age3": 234,
      "hdi1": 276,
      "hdi2": 313,
      "hdi3": 350,
      "hdi4": 387
    }
  };

  x = function(t) {
    if (positions[data.mode] && positions[data.mode][t]) return positions[data.mode][t];
    return null;
  }

  // axes
  var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(5)
    .orient("top");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

  // ***************************************************** main svg
  d3.selectAll("#vis").remove(); // remove old one
  svg = d3.select("body").append("svg")
    .attr("id", "vis")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // ***************************************************** background
  svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("fill", "#ffffff");

  // ***************************************************** custom segment
  if (data.mode == "thankyou" && data.customSegment) drawCustomSegment(data.customSegment);


  // ***************************************************** axes
  // svg.append("g")
  //   .attr("class", "x axis large")
  //   .attr("text-anchor", "start")
  //   .call(xAxis);

  // svg.select(".x.axis")
  //   .call(xAxis)
  //   .selectAll("text")
  //   .attr("transform", "rotate(-50)")
  //   .style("text-anchor", "start");

  // ***************************************************** headers
  svg.append("text")
    .attr("y", 0)    
    .attr("x", 0)
    .attr("dy", -95)
    .style("text-anchor", "start")
    .style("font-size", "32px")
    .style("fill", "#111")
    .style("font-weight", "bold")
    .text(data.lang.viz[ 'viz1_title' ]);

  svg.append("text")
    .attr("y", 0)
    .attr("dy", -65)
    .attr("x", 0)
    .style("text-anchor", "start")
    .style("font-size", "24px")
    .style("fill", "#666")
    .text(data.lang.viz[ 'viz1_subtitle' ]);

  // ***************************************************** labels
  svg.append("text")
      .attr("y", height+30)
      // .attr("x", x.rangeBand())
      .attr("x", segmentWidth)
      .attr("class", "segment-labels")
      .text(data.lang.viz[ 'location' ]);

  svg.append("text")
    .attr("y", height+30)
    // .attr("x", x.rangeBand()*3+10)
    .attr("x", segmentWidth*3+10)
    .attr("class", "segment-labels")
    .text(data.lang.viz[ 'gender' ]);     

  svg.append("text")
    .attr("y", height+30)
    // .attr("x", x.rangeBand()*6)
    .attr("x", segmentWidth*6)
    .attr("class", "segment-labels")
    .text(data.lang.viz[ 'age_groups' ]);  

  svg.append("text")
    .attr("y", height+30)
    // .attr("x", x.rangeBand()*9+20)
    .attr("x", segmentWidth*9+20)
    .attr("class", "segment-labels")
    .text(data.lang.viz[ 'hdi' ]);

  // ***************************************************** legend

  var legendPadding = {height: 15, space: 3},
      legendMargin = {top: 30, right: 0, bottom: 0, left: 450};

  var svgLegend = svg.append("g")
      .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

  svgLegend.append("text")
    .attr("class", "")
    .attr("y", -legendMargin.top)
    .attr("dy", "20px")
    .attr("x", 0)
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text(function() {
      if (data.mode == "thankyou") return data.lang.viz[ 'your_priorities' ];
      else return data.lang.viz[ 'your_priorities' ];
    });

  if (data.mode == "thankyou") {
    svgLegend.append("text")
      .attr("class", "")
      .attr("y", 155)
      .attr("x", 0)
      .style("font-size", "14px")
      .text(data.lang.viz[ 'other_priorities' ]);  
  }

  // ***************************************************** segment bars

  var seg =  svg.selectAll(".segments")
    .data(data.segments)
    .enter().append("g")
    .attr("class", "segments")
    .attr("transform", function(d,i) {
        return "translate(" + ( x(d.id) ) + ",0)";
    });

  // labels
  seg.append("text")
      .text(function(d) { 
        var t;
        if (d.id == "male") t = data.lang.fields_values.gender[1].name;
        else if (d.id == "female") t = data.lang.fields_values.gender[2].name;
        else if (data.lang.viz[d.id]) t = data.lang.viz[d.id];
        return t; 
      })
      .attr("x", segmentWidth/2)
      .attr("y", -3)
      .attr("transform", "rotate(-50, "+(segmentWidth/2)+", -3)")
      .attr("dy", "0em")
      .style("font-size", function(d) { return (d.id=="world") ? "15px" : "11px"; })
      .style("font-weight", function(d) { return (d.id=="world") ? "700" : "300"; })
      .style("text-anchor", "start");
       
  var segrect = seg.selectAll(".pri")
    .data(function(d) { return d.values.rankings; }, function(d) { return d.priid; })

  segrect.enter().append("rect")
    .attr("class", function(d, i) { return "pri pri" +i })
    // .attr("width", x.rangeBand())
    .attr("width", segmentWidth)
    .attr("y", function(d) { if(y(d.y0)) {return y(d.y0)} else {return 0}; })
    .attr("height", function(d, i) { if(y(d.y1)) {return y(d.y1)} else { return 0 }; })
    .style("fill", function(d,i) { return data.lang.accordion_items[d.priid]['item-color']})
    .on("mouseover", function(d) { return (!png) ? highlight(d) : null; })
    .on("mouseout", function(d) { return (!png) ? highlightOff(d) : null; })

  segrect.exit().remove();

  seg.selectAll(".pritext")
    .data(function(d) { return d.values.rankings; })
    .enter().append("text")
    .attr("class", "pritext")
    // .attr("x", x.rangeBand()/2)
    .attr("x", segmentWidth/2)
    .attr("y", function(d) {return y(d.y0); })
    .attr("dy", "10px")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("display", "none")
    .style("fill", function(d) { 
        if (d.priid == 15 || d.priid == 16){ return "#000" }
        return "#fff" 
    })
    .text(function(d,i) { return "#"+(i+1)})
    .on("mouseover", function(d) { return (!png) ? highlight(d) : null; })
    .on("mouseout", function(d) { return (!png) ? highlightOff(d) : null; })

  // ***************************************************** Custom Segment Titles

  if (data.mode != "results") {

    svg.append("text")
      .attr("x", 857)
      .attr("y", -80)
      .text(data.lang.viz.tip2)
      .style("text-anchor", "middle")
      .style("font-size", "11px")
      .style("font-weight", "900");

    svg.append("line")
      .attr("y1", -55)
      .attr("y2", -10)
      .attr("x1", 857)
      .attr("x2", 857)
      .style("stroke", "#ccc")

    var custom_country = svg.append("image")
      .attr( "xlink:href", "assets/flags/"+data.user.country+".gif")
      .attr("class", "custom-country")
      .attr("y", -55)
      .attr("x", 828)
      .attr( "width", 22 )
      .attr( "height", 15 );

    var custom_gender = svg.append("text")
      .attr("class", "custom-segment-labels custom-gender")
      .attr("y", -25)
      .attr("dy", 0)
      .attr("x", 850)
      .style("text-anchor", "end");

    var custom_age = svg.append("text")
      .attr("class", "custom-segment-labels custom-age")
      .attr("dy", -10)
      .attr("x", 850)
      .style("text-anchor", "end");

    var custom_votes_number = svg.append("text")
      .attr("class", "custom-segment-labels custom-votes")
      .attr("y", -35)
      .attr("x", 864)
      .style("text-anchor", "start")
      .style("font-weight", "bold");

    var custom_votes = svg.append("text")
      .attr("y", -22)
      .attr("x", 864)
      .style("text-anchor", "start")
      .text(data.lang.viz['votes']);

    // add text
    var gender = (parseInt(data.user.gender)==1) ? 1 : 2;
    custom_gender.text(data.lang.fields_values.gender[gender].name);
    custom_votes_number.text(data.customSegment.values.tVotes);
    var ageLabel,
        age = parseInt(data.user.age);
    if (age < 35) ageLabel = "age1";
    else if (age > 34 && age < 55) ageLabel = "age2";
    else if (age > 54) ageLabel = "age3";
    custom_age.text(data.lang.viz[ageLabel]);

  }

  // ****************************************************************** draw legend

  var legendPadding = (data.mode == "thankyou") ? {height: 15, space: 3} : {height: 20, space: 6},
      legendMargin = {top: 35, right: 0, bottom: 0, left: 450};

  var svgLegend = svg.append("g")
      .attr("id", "prioritiesLegend")
      .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

  var legend = svgLegend.selectAll(".legend")
    .data(data.userChoices_others)
    .enter().append("g")
    .attr("class", "legend")
    .on("mouseover", function(d) { return (!png) ? highlight(d) : null; })
    .on("mouseout", function(d) { return (!png) ? highlightOff(d) : null; });

  // legend
  //   .append("rect")
  //   .attr("class", "legendboxback")
  //   .attr("x", 0)
  //   .attr("y", function(d,i) {
  //   if (i>5) {return (i+3)*(legendPadding.space+legendPadding.height)}
  //   return i*(legendPadding.space+legendPadding.height)})
  //   .attr("width", 250)
  //   .attr("height", legendPadding.space+legendPadding.height)
  //   .style("fill", "#fff")

  legend
    .append("rect")
    .attr("class", "legendbox")
    .attr("x", 0)
    .attr("y", function(d,i) {
      if (data.mode == "thankyou") {
        if (i>5) {return (i+3)*(legendPadding.space+legendPadding.height)}
        return i*(legendPadding.space+legendPadding.height)
      } else {
        return i*(legendPadding.space+legendPadding.height);
      }
    })
    .attr("width", legendPadding.height)
    .attr("height", legendPadding.height)
    .style("fill", function(d,i) { 
        return data.lang.accordion_items[d]['item-color'];
    })
    .style("opacity", function(d,i) { 
        return 1;
    })

  legend
    .append("text")
    .attr("y", function(d,i) {
      if (data.mode == "thankyou") {
        if (i>5) {return (i+3)*(legendPadding.space+legendPadding.height)}
        return i*(legendPadding.space+legendPadding.height)
      } else {
        return i*(legendPadding.space+legendPadding.height);
      }
    })
    .attr("dy", "1em")
    .attr("x", legendPadding.space+legendPadding.height)
    .style("font-size", function(d,i) {
      if (data.mode == "thankyou") {
        if (i>5) {return "11px"}
        return "13px";
      } else {
        return "13px";
      }
    })
    .style("fill", function(d,i) { 
      if (data.mode == "thankyou") {
        if (i>5) {return "#666"}
        return "#111";
      } else {
        return "#111";
      }
    })
    .text(function(d,i) {return data.lang.accordion_items[d]['item-title']});

  // credit stamp
  var stamp = svg.append("g").attr("transform", "translate(452, 475)");
  
  var now = new Date(),
      dte = [now.getDate(), now.getMonth(), now.getFullYear()].join("-"),
      url = "http://www.myworld2015.org/";

  stamp.append("text")
    .text(url)
    .attr("fill", "#999")
    .style("font-size", "10px");

  stamp.append("text")
    .attr("x", 160)
    .text(dte)
    .attr("fill", "#999")
    .style("font-size", "10px");


}

// ****************************************************************** draw segments bar

function drawCustomSegment(newdata) {

  newdata = processSegmentData(newdata);

  var scxpos =840;
  var sc = svg.selectAll(".sc")
    .data(newdata.values.rankings, function(d) { return d.priid; })

  var scEnter = sc.enter().insert("g", ".axis")
    .attr("class", "sc")
    .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
    .style("fill-opacity", 0);

  scEnter.append("rect")
    .attr("class", function(d, i) { return "pri pri" +i })
    // .attr("width", x.rangeBand())
    .attr("width", segmentWidth)
    .attr("height", function(d) { return y(d.y1)})
    .style("fill", function(d,i) { return data.lang.accordion_items[d.priid]['item-color']})
    .on("mouseover", function(d) { return (!png) ? highlight(d) : null; })
    .on("mouseout", function(d) { return (!png) ? highlightOff(d) : null; })

  scEnter.append("svg:image")
    .attr("class", function(d, i) { return "pri pri" +i })
    .classed("check", true)
    .attr( "xlink:href", function(d) {
      if (data.userChoices.indexOf(parseInt(d.priid)) > -1 ) { return "assets/icons/ballot/check.png";}
      return null })
    .attr( "width", 20 )
    .attr( "height", 15 )
    .attr("opacity", 0);

  sc.selectAll(".check")
    .attr("transform", function(d){ return "translate(" + (segmentWidth * 0.8) + "," + (y(d.y1)/2 - 13) + ")"});

  scEnter.append("text")  
    .attr("class", "pritext")
    .attr("x", segmentWidth/2)
    .attr("dy", "10px")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .style("display", "none")
    .style("fill", function(d) { 
      if (d.priid == 15 || d.priid == 16){
        return "#000"
      }
      else {
        return "#fff"
      }
      })
    .text(function(d,i) { return "#"+(i+1)})
    .on("mouseover", function(d) { return (!png) ? highlight(d) : null; })
    .on("mouseout", function(d) { return (!png) ? highlightOff(d) : null; });

  var scUpdate = d3.transition(sc)
    .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
    .style("fill-opacity", 1);

  scUpdate.select("rect")
    .attr("height", function(d) { return y(d.y1)})

  scUpdate.select("image")
    .attr("opacity", 1)

  scUpdate.select("text")
    .text(function(d,i) { return "#"+(i+1)})

  var scExit = d3.transition(sc.exit())
        .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
        .style("fill-opacity", 0)
        .remove();

  scExit.select("rect")
    .attr("height", function(d) { return y(d.y0)});

  scExit.select("image")
    .attr("opacity", 0);

}


function processSegmentData(d) {

  var y0 = 0;
  var t = 0;
  
  d.values.rankings.forEach(function(f) {
    t += f["count"]
  });

  d.values.totalvotes = t;
  var m = 0;
  var p = 0;
  
  d.values.rankings.forEach(function(f, i) {
      m += p;
      p = parseFloat(f["count"]/t);
      f["y1"] = p;
      f["y0"] = m;
      f["priid"] = f["id"]
    }); 

  return d;
}