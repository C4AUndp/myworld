// =========================== Loading Divs
$(".viz-wrapper-results").append($('<div id="" class="viz-loading '+current_lang+'"><div><span>Loading...</span></div></div>'))
$(".viz-wrapper").append($('<div id="" class="viz-loading-2 '+current_lang+'"><div><span>Loading...</span></div></div>'))


//  GLOBAL VARS
var cfg = {};
cfg.mapzoom = 0;
cfg.mode = 1; // 0 = Thank You, 1= Public Results

// =========================== User Vars
var metadata = 'assets/langs/' + current_lang + '.json';

var goodCountries = [24, 30, 53, 181, 185, 183, 66, 134, 88, 159, 96, 77, 61, 78, 110, 161, 31, 151, 36, 16, 193, 65, 170, 83, 177, 136, 7, 121, 37, 138, 17, 141]
var resultCountry = goodCountries[Math.floor(Math.random() * goodCountries.length)];
var resultGender = 0;
var resultAge = Math.floor((Math.random()*30)+1);
var resultChoices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var resultChoices_others = [1,2,3,4,5,6];


// =========================== User Vars
var userData = JSON.parse( $.cookie( 'vote_data' ))


if (userData){
  // console.log(userData)

  var userCountry = userData['country'];
  var userGender = userData['gender'];
  var userAge = userData['age'];
  var userChoices = userData['choices'].slice(0);

  for(var i = userChoices.length-1; i >= 0; i--){  
      if(userChoices[i] == 0){           
          userChoices.splice(i,1);
      }
  }

  var userChoices_others = userChoices.slice(0);

  if (userAge < 35) {userAge = "&age_ub=34" }
  else if (userAge > 34 && userAge < 55) { userAge = "&age_lb=35&age_ub=54"}
  else if (userAge > 54) {userAge = "&age_lb=55"}

    // USER CHOICES
    for (var i=1; i<17; i++ ) {
      if (userChoices.indexOf(i) < 0) { 
        userChoices_others.push(i);
      }
    }
}



// API VARS
// var api = "http://clients.seedvisualization.com/api/myworld/public/";
var api = "http://54.227.246.164/stats/public/";
var urlList = "assets/langs/default.json";
var urlMap = "viz/worldmap.json";
var urlStats = "http://54.227.246.164/static/map_stats.json";
var urlSegments = "http://54.227.246.164/static/segment_comparison.json";
var urlCounter = "http://54.227.246.164/stats/totalvotes";
// var urlSimilar = api + "sampleSimilar?choices=" + userChoices.toString();

var countryList,
    countries,
    genders,
    educations,
    priorities,
    segments,
    worldmap,
    mapStats,
    mapTime,
    mapSimilar,
    vizmetadata,
    cTitle,
    people;


// Map Colors & Format
var coma = d3.format(",f");
var colorFill = d3.scale.sqrt()
    .domain([10000 , 100, 0])
    .range(["#2469AE", "#C7D8E5", "#FFFFFF"]);


// =========================== Load Data
$.getJSON(urlList, function(list) { 
  countryList = list.fields_values.countries;
  getPeople();
})

var getPeople = function(){ 
                      $.getJSON(urlCounter, function(data) { 
                        people = data.total;
                        getVizmetadata();
                      })}     

var getVizmetadata = function(){ 
                      $.getJSON(metadata, function(lang) {
                        vizmetadata = lang.viz;
                        countries = lang.fields_values.countries;
                        genders = lang.fields_values.gender;
                        educations = lang.fields_values.education;
                        priorities = lang.accordion_items;                       
                        getMap();
                      })}

var getMap = function(){ 
                      $.getJSON(urlMap, function(map) { 
                        worldmap = map.features;
                        getMapStats(); 
                      })}

var getMapStats = function(){ 
                      $.getJSON(urlStats, function(stats) { 
                        mapStats = stats.countries;
                        mapTime = stats.computed_at;
                        getSegments();
                      })}                      

var getSegments = function(){ 
                      $.getJSON(urlSegments, function(data) { 
                        segments = data;
                        ready();
                      })}




var getUserData = function() {

  userData = JSON.parse( $.cookie( 'vote_data' ))
  userCountry = userData['country'];
  userGender = userData['gender'];
  userAge = userData['age'];
  userChoices = userData['choices'].slice(0);

    for(var i = userChoices.length-1; i >= 0; i--){  
      if(userChoices[i] == 0){           
          userChoices.splice(i,1);
      }
  }
  
  userChoices_others = userChoices.slice(0);

  if (userAge < 35) {userAge = "&age_ub=34" }
  else if (userAge > 34 && userAge < 55) { userAge = "&age_lb=35&age_ub=54"}
  else if (userAge > 54) {userAge = "&age_lb=55"}

    // USER CHOICES
    for (var i=1; i<17; i++ ) {
      if (userChoices.indexOf(i) < 0) { 
        userChoices_others.push(i);
      }
    }

  postvote_UI();
  postvote_Segments_pre(segments);
  postvote_Map();

}


function ready() {

  segments = [
    {title: vizmetadata[ 'world' ], values:segments['total']},
    {title: genders[1][ 'name' ], values:segments['gender1']},
    {title: genders[2][ 'name' ], values:segments['gender2']},
    {title: vizmetadata[ 'age1' ], values:segments['ageGroup1']},
    {title: vizmetadata[ 'age2' ], values:segments['ageGroup2']},
    {title: vizmetadata[ 'age3' ], values:segments['ageGroup3']},
    {title: vizmetadata[ 'hdi1' ], values:segments['hdi1']},
    {title: vizmetadata[ 'hdi2' ], values:segments['hdi2']},
    {title: vizmetadata[ 'hdi3' ], values:segments['hdi3']},
    {title: vizmetadata[ 'hdi4' ], values:segments['hdi4']}
  ]
  
  counters();

  results_UI();
  results_Segments(segments);
  results_Map();

  if (userData){
    postvote_UI();
    postvote_Segments_pre(segments);
    postvote_Map();
  }
  
}


var counters = function () {

  // var people = d3.sum(mapStats, function(d){return d.tVotes})

  var countryCholder = $("#cnumber, #cnumber-header, #cnumber-small");
  var countryC = (mapStats.length).toString().split('');

  var peopleCholder = $("#pnumber-header");
  var peopleC = people.toString().split('');
  //var peopleC = "966255";

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
}


var postvote_Segments_pre = function (data) {
  var customCall = api+"segment?country="+userCountry;
  $.getJSON(customCall, function(ndata) {
    cTitle = $.grep(countries, function(num, index) { return num.id == userCountry });
    cTitle = cTitle[0].name; 
    var pdata = {title: cTitle, values:ndata}
    data.splice(1, 0, pdata)
    postvote_Segments(data)
  })
}

var postvote_Segments = function (data) {

  var newdata; // Load Custom Segment
  var pad = 0.02;
  var padLarge = [0,0,5,5,10,10,10,15,15,15,15];

  var margin = {top: 120, right: 0, bottom: 40, left: 0},
    width = 906 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width-496], pad);

  var y = d3.scale.linear()
    .range([0, height]);

  data.forEach(function(d) {
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
  }); 


  x.domain(data.map(function(d) { return d.title; }));
  y.domain([d3.min(data, function(d) { return d3.min(d.values.rankings, function(z) { return z.y0})}), d3.max(data, function(d) { return d3.max(d.values.rankings, function(z) { return z.y0})})])


  var svg = d3.select("#viz-explore").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Visualization Header
  svg.append("text")
    .attr("class", "viz-title "+current_lang)
    .attr("y", 0)    
    .attr("x", 0)
    .attr("dy", function(d){
      if(current_lang=="ru") { return -100}
      return -95
    })
    .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text(vizmetadata[ 'viz1_title' ]);

  svg.append("text")
    .attr("class", "viz-subtitle "+current_lang)
    .attr("y", 0)
    .attr("x", 0)
    .attr("dy", function(d){
      if(current_lang=="ru") { return -77}
      return -65
    })
    .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text(vizmetadata[ 'viz1_subtitle' ]);  

// Segment Titles
  svg.append("text")
      .attr("y", height+30)
      .attr("x", x.rangeBand())
      .attr("class", "segment-labels location "+current_lang)
      .text(vizmetadata[ 'location' ]);

  svg.append("text")
    .attr("y", height+30)
    .attr("x", x.rangeBand()*3+10)
    .attr("class", "segment-labels "+current_lang)
    .text(vizmetadata[ 'gender' ]);     

  svg.append("text")
    .attr("y", height+30)
    .attr("x", x.rangeBand()*6)
    .attr("class", "segment-labels "+current_lang)
    .text(vizmetadata[ 'age_groups' ]);  


  svg.append("text")
    .attr("y", height+30)
    .attr("x", x.rangeBand()*9+25)
    .attr("class", "segment-labels "+current_lang)
    .text(vizmetadata[ 'hdi' ]);

// Custom Segment Titles

  svg.append("line")
    .attr("y1", -55)
    .attr("y2", -10)
    .attr("x1", 857)
    .attr("x2", 857)
    .style("stroke", "#ccc")


    var custom_country_text = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -40)
    .attr("dy", 0)
    .attr("x", function(d,i) { 
      return 850 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "start" };
      return "end" 
    })
        .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text("");   

  var custom_country = svg.append("image")
    .attr( "xlink:href", "viz/flags/"+1+".gif")
    .attr("y", -55)
    .attr("x", 828)
    .attr( "width", 22 )
    .attr( "height", 15 )

  var custom_country_title = custom_country.append("svg:title")
    .text("")




  var custom_gender = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -25)
    .attr("dy", 0)
    .attr("x", function(d,i) { 
      return 850 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "start" };
      return "end" 
    })
        .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text(""); 

  var custom_age = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("dy", -10)
    .attr("x", function(d,i) { 
      return 850 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "start" };
      return "end" 
    })
        .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text("");

  var custom_votes_number = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -35)
    .attr("x", function(d,i) { 
      return 864 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "end" };
      return "start" 
    })
        .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .style("font-weight", "bold")
    .text("");          

  var custom_votes = svg.append("text")
    .attr("class", "viz-custom-segment-labels-votes "+current_lang)
    .attr("y", -22)
    .attr("x", function(d,i) { 
      return 864 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "end" };
      return "start" 
    })
    .text(vizmetadata[ 'votes' ]);  

  
// PRIORITIES LEGEND

var legendPadding = {height: 16, space: 3},
    legendMargin = {top: 30, right: 0, bottom: 0, left: 450};

if (current_lang == "ar") {legendMargin.left = 710};    

var svgLegend = svg.append("g")
    .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

svgLegend.append("text")
    .attr("class", "")
    .attr("y", -legendMargin.top)
    .attr("dy", "20px")
    .attr("x", 0)
    .style("font-size", "24px")
    .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text(vizmetadata[ 'priorities' ]);

svgLegend.append("text")
    .attr("class", "")
    .attr("y", 155)
    .attr("x", 0)
    .style("font-size", "14px")
    .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text(vizmetadata[ 'other_priorities' ]);  

var legend = svgLegend.selectAll(".legend")
    .data(userChoices_others)
    .enter().append("g")
    .attr("class", "legend")
    // .attr("transform", function(d) { return "translate(" + -margin.left +  ",0)"; })
    .on("mouseover", function(d) { return highlight(d)})
    .on("mouseout", function(d) { return highlightOff(d)})

legend
    .append("rect")
    .attr("class", "legendboxback")
    .attr("x", function(d,i) { 
      if (current_lang=="ar") { return -250};
      return 0;
    })
    .attr("y", function(d,i) {
    if (i>5) {return (i+3)*(legendPadding.space+legendPadding.height)}
    return i*(legendPadding.space+legendPadding.height)})
    .attr("width", 250)
    .attr("height", legendPadding.space+legendPadding.height)
    .style("fill", "#fff")

legend
    .append("rect")
    .attr("class", "legendbox")
    .attr("x", 0)
    .attr("y", function(d,i) {
        if (i>5) {return (i+3)*(legendPadding.space+legendPadding.height)}
        return i*(legendPadding.space+legendPadding.height)
    })
    .attr("width", legendPadding.height)
    .attr("height", legendPadding.height)
    .style("fill", function(d,i) { 
        return priorities[d]['item-color'];
    })
    .style("opacity", function(d,i) { 
        return 1;
    })

legend
    .append("text")
    .attr("y", function(d,i) {
        if (i>5) {return (i+3)*(legendPadding.space+legendPadding.height)}
        return i*(legendPadding.space+legendPadding.height)
    })
    .attr("dy", "1em")
    .attr("x", function(d,i) { 
      if (current_lang=="ar") { return -legendPadding.space };
      return legendPadding.space+legendPadding.height 
    })
    .style("font-size", function(d,i) { 
        if (i>5) {return "11px"}
        return "13px";
    })
    .style("fill", function(d,i) { 
        if (i>5) {return "#666"}
        return "#111";
    })
    .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
    .text(function(d,i) {return priorities[d]['item-title']});


//  SEGMENT BARS
var seglabels = svg.selectAll(".x.axis")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d,i) { 
        return "translate(" + ( x(d.title) + padLarge[i] + x.rangeBand()/2 ) + ",-5)"; 
    });

    seglabels.append("text")
      .attr("class", "viz-explore-labels "+current_lang)
      .attr("transform", "rotate(-50)")
      .style("font-size", function(d,i) { 
        if(i==0) {return "14px"}
        return "11px";
      })
      .style("font-weight", function(d,i) { 
        if(i==0) {return "bold"}
        return "regular";
      })
          .style("direction", function(d,i) { 
      if (current_lang=="ar") { return "rtl" };
    })
      .text(function(d,i){
        if(i==1) {return ""}
        return d.title})

var userCountryFlag = svg.append("image")
      .attr( "xlink:href", "viz/flags/" + userData['country'] + ".gif")
      .attr("x", x(cTitle)+6)
      .attr("y", -22)
      .attr( "width", 22 )
      .attr( "height", 15 )
      .append("title").text(cTitle)


var seg =  svg.selectAll(".segments")
    .data(data)
    .enter().append("g")
    .attr("class", "segments")
    .attr("transform", function(d,i) { 
        return "translate(" + ( x(d.title) + padLarge[i] ) + ",0)"; 
    });
       
var segrect = seg.selectAll(".pri")
    .data(function(d) { return d.values.rankings; }, function(d) { return d.priid; })

segrect.enter().append("rect")
    .attr("class", function(d, i) { return "pri pri" +i })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { if(y(d.y0)) {return y(d.y0)} else {return 0}; })
    .attr("height", function(d, i) { if(y(d.y1)) {return y(d.y1)} else { return 0 }; })
    .style("fill", function(d,i) { return priorities[d.priid]['item-color']})
    .on("mouseover", function(d) { return highlight(d)})
    .on("mouseout", function(d) { return highlightOff(d)})

segrect.exit().remove();

seg.selectAll(".pritext")
    .data(function(d) { return d.values.rankings; })
    .enter().append("text")
    .attr("class", "pritext")
    .attr("x", x.rangeBand()/2)
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
    .on("mouseover", function(d) { return highlight(d)})
    .on("mouseout", function(d) { return highlightOff(d)})


function highlight(selected){
  if(selected.priid) { selected = selected.priid}

  d3.selectAll(".pri")
    .filter(function(d) { return d.priid == selected; })

  d3.selectAll(".pritext")
    .filter(function(d) { return d.priid == selected; })
    .style("display", "block");

  d3.selectAll(".pri")
    .filter(function(d) { return d.priid != selected; })
    .style("opacity", .2)

  d3.selectAll(".legend")
    .filter(function(d) { return d != selected; })
    .style("opacity", .2)
}

function highlightOff(selected){
  d3.selectAll(".pri, .legend")
    .style("opacity", 1)

  d3.selectAll(".pritext").style("display", "none")
}

function callCustom(){
  var s_country = $('select#s-country').val();
  var s_gender = $('select#s-gender').val(); 
  var s_age = $('select#s-age').val(); 

  var customCall = api+"segment?"+s_country+s_gender+s_age;
  $.getJSON(customCall, function(ndata) { 

  custom_votes_number.text(coma(ndata.tVotes));      
  newdata = ndata.rankings
  var m = 0;
  var t = ndata.tVotes*6;
  newdata.forEach(function(d,i) {
      var p = parseFloat(d["count"]/t);
      d["y1"] = p;
      d["y0"] = m;
      d["priid"] = d["id"]
      m += p;
    });

  d3.transition()
    .duration(750)
    .each(redraw);
  })

  var ccode = s_country.substring(9)
  ccode = parseInt(ccode);

  if(ccode == 0 || isNaN(ccode)) {
    custom_country.style("opacity", 0)
    custom_country_text.style("opacity", 1)
    custom_country_text.text($('#s-country>option:selected').text())
  }

  else if (ccode >0) {
    custom_country.style("opacity", 1)
    custom_country_text.style("opacity", 0)
    custom_country.attr("xlink:href", "viz/flags/"+s_country.substring(9)+".gif")
    custom_country_title.text($('#s-country>option:selected').text())
  }

  custom_gender.text($('#s-gender>option:selected').text()); 
  custom_age.text($('#s-age>option:selected').text());
}


function redraw(){
    var scxpos =840;
    var sc = svg.selectAll(".sc")
      .data(newdata, function(d) { return d.priid; })

    var scEnter = sc.enter().insert("g", ".axis")
      .attr("class", "sc")
      .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
      .style("fill-opacity", 0);

      scEnter.append("rect")
      .attr("class", function(d, i) { return "pri pri" +i })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return y(d.y1)})
      .style("fill", function(d,i) { return priorities[d.priid]['item-color']})
      .on("mouseover", function(d) { return highlight(d)})
      .on("mouseout", function(d) { return highlightOff(d)});

      scEnter.append("svg:image")
      .attr("class", function(d, i) { return "pri pri" +i })
      .attr( "xlink:href", function(d) {
        // console.log(userChoices.indexOf(parseInt(d.priid)))
        if (userChoices.indexOf(parseInt(d.priid)) > -1 ) { return "assets/icons/ballot/check.png";}
        return null })
      .attr("transform", function(d){ return "translate(" + (x.rangeBand() * 0.8) + "," + (y(d.y1)/2 - 13) + ")"})
      .attr( "width", 20 )
      .attr( "height", 15 )
      .attr("opacity", 0);

      scEnter.append("text")  
      .attr("class", "pritext")
      .attr("x", x.rangeBand()/2)
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
      .on("mouseover", function(d) { return highlight(d)})
      .on("mouseout", function(d) { return highlightOff(d)})


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

  // CUSTOM SEGMENT CALL

  $("a#viz-custom").click(function(event) {
      event.preventDefault();
      callCustom();
      $(".tooltip-custom").fadeOut(300);
   });   
   
  callCustom();  

}

//  ================================================ PostVote Map

function postvote_Map() { 
  var similars;   
  var format = d3.time.format("%Y-%m-%d");
  var eDate = new Date(mapTime*1000);
  var country;
  var pick = userCountry;  
  var mapScale = 175;
  var zoomLevel = 1;
  var markers = true;
  var popSimilar;

  // Add Tooltip
  var markerTooltip = d3.select("body")
    .append("div")
    .attr("class", "markertooltip "+current_lang)
    .style("position", "absolute")
    .style("z-index", "999")
    .style("visibility", "hidden")
    .text("");

  userChoices = userChoices.sort(function(a,b){return a-b})
  var urlSimilar = api + "sampleSimilar?choices=" + userChoices.toString();
  $.getJSON(urlSimilar, function(s) {
    similars = s;
    showSimilars();
  })



  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  var maxVotes = d3.max(mapStats, function(d){ return d.tVotes})
  maxVotes = roundTo(maxVotes,10000)

  colorFill.domain([maxVotes, 100 , 0])

  var m = [0, 0, 0, 0],
      w = 896,
      h = 650

  // Mercator Projection Settings
  var projection = d3.geo.eckert3()
      .scale([mapScale])
      .translate([w/2,h/2+40]);

  var path = d3.geo.path()
      .projection(projection);

  var zoom = d3.behavior.zoom()
      .translate(projection.translate())
      .scale(projection.scale())
      .scaleExtent([mapScale, 16 * mapScale])
      .on("zoom", move);


  var map = d3.select("#viz-map").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h - m[0] + m[2])
      .attr("pointer-events", "all")
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
      .on("dblclick", null)
      .call(zoom)

      map.append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .style("fill", "#fff")

    worldmap.forEach(function(d){
      var cid = $.grep(countryList, function(num, index) { return num.name == d.properties.name })
      if (cid.length>0) {
        d.properties.cid = cid[0].id 
        var votes = $.grep(mapStats, function(num, index) { return num.country == cid[0].id })
        if(votes.length>0) { 
          d.votes = votes[0].tVotes 
        }
        else {d.votes = 0}  
      }
      else { 
        d.properties.cid = 0; 
        d.votes = -1;
      }
    })

  map.append("svg:g")
  country = map.selectAll(".country")
      .data(worldmap)
    .enter().append("svg:path").attr("d", path);



  var cNames = map.selectAll(".country")
      .data(worldmap)
      .enter().append("svg:text")
      .filter(function (d){return d.properties.cid > 0  })
    .attr("transform", function(d,i) {
      var l = projection(d.properties.loc)
      return "translate(" + l[0] + "," + l[1] + ")"
    })
    .style("text-anchor", "middle")
    .style("font-size", "9px")
    .style("fill", "#111")
    .style("opacity", 0)
    .style("display","none")
    .text(function(d) { 
      var cname = $.grep(countries, function(num, index) {return num.id == d.properties.cid })
      return cname[0].name; });


  var popContainer = map.append("g");


// Visualization Header
  map.append("rect")
    .attr("y", 0)    
    .attr("x", 0)
    .attr("width", w)
    .attr("height", 60)
    .style("fill", "#FFFFFF")
    .style("opacity", .5)

  map.append("text")
    .attr("class", "viz-title "+current_lang)
    .attr("y", 5)    
    .attr("x", 5)
    .attr("dy", 25)
    .text(vizmetadata[ 'viz2_title' ]);

  map.append("text")
    .attr("class", "viz-subtitle "+current_lang)
    .attr("x", 5)
    .attr("y", 5)
    .attr("dy", 55)
    .text(vizmetadata[ 'viz2_subtitle' ]);  

  map.append("text")
    .attr("class", "viz-map-date "+current_lang)
    .attr("x", w)
    .attr("y", h)
    .attr("dy", -5)
    .text(vizmetadata[ 'country_totals' ] +  eDate);    

  var zoomButtons = map.append("g");

    zoomButtons.append("image")
    .attr("class", "zoom-buttons")   
    .attr( "xlink:href", "viz/img/zoom.png")
    .attr("y", 60)
    .attr("x", w-60)
    .attr( "width", 29 )
    .attr( "height", 58);

    zoomButtons.append("rect")
    .attr("class", "zoom-buttons")   
    .attr("x", w-60)
    .attr("y", 60)
    .attr( "width", 30)
    .attr( "height", 30)
    .style("fill", "#fff")
    .style("opacity", 0)
    .on("click", zoomIn)

    zoomButtons.append("rect")
    .attr("class", "zoom-buttons")   
    .attr("x", w-60)
    .attr("y", 90)
    .attr( "width", 30)
    .attr( "height", 30)
    .style("fill", "#fff")
    .style("opacity", 0)
    .on("click", zoomOut)


  country
    // .attr("class", function(d){ if (d.properties.cid==pick) { return "picked"} })
    .style("fill", function(d){      
      // if (d.properties.cid==pick) { return "#333"}
      return colorFill(d.votes)
      })
     // .on("click", click)
    .call(d3.helper.tooltip(function(d, i){
        var cname = $.grep(countries, function(num, index) {return num.id == d.properties.cid })
        if (d.properties.cid){
        return "<span><strong>" + cname[0].name + " </strong><br> " + vizmetadata['votes'] +": " + coma(d.votes) +"</span>";
        }
        return null
      }));    


    // country.append("svg:title").text(function(d) { return d.properties.name; });






// Map Legend

var legendpad = 24; // Legend Padding
var legendsize = 18; // Legend Box Size

  map.append("rect")
    .attr("y", h-legendpad*5)    
    .attr("x", 0)
    .attr("width", legendpad*5)
    .attr("height", legendpad*5)
    .style("fill", "#FFFFFF")
    .style("opacity", .5)

var legend = map.selectAll(".legend")
    .data(colorFill.domain())
    .enter().append("g")
    .attr("transform", "translate(" + legendpad + "," + (h-legendpad*4) + ")")

    legend.append("rect")
      .attr("y", function (d,i) {
        if (i>1) { i = 5}
        return i*legendpad})
      .attr("x", 0)
      .attr("height", legendsize)
      .attr("width", legendsize)
      .style("fill", function (d,i) {return colorFill(d)})
      .style("stroke", "#ddd");

    legend.append("text")
      .attr("class", "viz-map-legend "+current_lang)
      .attr("y", function (d,i) {
        if (i==0) { return 0 }
        else if (i==1) { return legendsize*3 }
        else if (i==2) { return legendpad*3+10 }}
        )
      .attr("x", 0)
      .attr("dx", legendsize+8)
      .attr("dy", 4)
      .text(function (d,i) {
          if (d == 0) {return vizmetadata['none']}
          return "~" + coma(d);
          })

var gradient = map.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", colorFill.range()[0])
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "80%")
    .attr("stop-color", colorFill.range()[1])
    .attr("stop-opacity", 1);

  legend.append("svg:rect")
    .attr("y", 0)
    .attr("x", 0)
    .attr("width", legendsize)
    .attr("height", legendsize*3)
    .style("fill", "url(#gradient)");

    legend.append("svg:rect")
    .attr("y", legendpad*3)
    .attr("x", 0)
    .attr("width", legendsize)
    .attr("height", legendsize)
    .style("stroke-width", "0.5px")
    .style("stroke", "#999")
    .style("fill", "#fff");  


  function zoomIn(){
    zoomLevel++;
    movePaths(zoomLevel);
  }

  function zoomOut(){
    zoomLevel--;
    movePaths(zoomLevel);
  }

  function move() {
    // console.log("pos: " + d3.event.translate)
    // console.log("zoom: " + d3.event.scale)

    zoomLevel = d3.event.scale/mapScale
    
    var t = d3.event.translate,
      s = d3.event.scale;
      t[0] = Math.max(-s*2, Math.min(w + s*2, t[0]));
      t[1] = Math.max(-s*2, Math.min(h + s*2, t[1]));
      // t[0] = Math.max(-t[0]*z, t[0]*z);
      // t[1] = Math.max(-t[1]*z, t[1]*z);
      // console.log(t)
      zoom.translate(t).scale(s);
      projection.translate(t).scale(s);

    // Show / Hide Country Names
    if (zoomLevel>4) {
      cNames.transition()
      .style("opacity",1)
      .style("display","block")
    }

    else if (zoomLevel<4) {
      cNames.transition()
      .style("opacity",0)
      .style("display","none")
    }

    country.attr("d", path);
    cNames.attr("transform", function(d,i) {
      var l = projection(d.properties.loc)
      return "translate(" + l[0] + "," + l[1] + ")"
    })

    if(popSimilar){
        popSimilar.attr("transform", function(d,i) {
          var l = projection(d.loc)
          return "translate(" + l[0] + "," + l[1] + ")"
        })
    }
  }

  function movePaths(zoomLevel){
    if (zoomLevel<1) {zoomLevel=1}
    if (zoomLevel>1) {markers=false}  
    if (zoomLevel>10) {zoomLevel=10}

    var s = zoomLevel*mapScale,
    t = projection.translate();
    // zoom.translate(t).scale(s);
    // projection.translate(t).scale(s);

    zoom.scale(s);
    projection.scale(s);

    country.transition().duration(500).attr("d", path);
    if (zoomLevel>=4) {
      // console.log(zoomLevel)
      cNames.transition().duration(500)
      .attr("transform", function(d,i) {
        var l = projection(d.properties.loc)
        return "translate(" + l[0] + "," + l[1] + ")"
      })
      .style("opacity",1)
      .style("display","block")
    }

    else if (zoomLevel<4) {
      cNames.transition().duration(500)
      .style("opacity",0)
      .style("display","none")
    }

    if(popSimilar){
      popSimilar.transition().duration(500).attr("transform", function(d,i) {
        var l = projection(d.loc)
        return "translate(" + l[0] + "," + l[1] + ")"
      })
    } 
  }

  function showSimilars() {

    similarBallots = similars.samples

    similarBallots.forEach(function(d,i){
      var c = $.grep(worldmap, function(ct, index) { return ct.properties.cid == d.country })
      var cname = $.grep(countries, function(ct, index) {return ct.id == d.country })
      d.loc = c[0].properties.loc;
      d.name = cname[0].name;
      d.choices = d.choices.sort(function(a,b){return a-b})
      d.globe = d.choices.join("_");
    })

    var regions = [
        [1,2,4,5],
        [2,4,5,8],
        [4,5,8,3],
        [5,8,3,6],
        [8,3,6,7],
        [3,6,7,9],
        [6,7,9,10],
        [7,9,10,18],
        [9,10,18,12],
        [10,18,12,15],
        [18,12,15,11],
        [12,15,11,21],
        [15,11,21,22],
        [11,21,22,14],
        [21,22,14,20],
        [22,14,20,16],
        [14,20,16,19],
        [20,16,19,13],
        [16,19,13,17],
        [19,13,17,1],
        [13,17,1,2],
        [17,1,2,4]
      ]

    var activeRegionSet = 0;
    var similarBallotsFiltered;

    

    var interval = setInterval(function() { 
      
      activeRegionSet++;
      if(activeRegionSet>regions.length-1) {activeRegionSet=0};

      
    
      d3.transition().duration(750).each(redrawSimilar);
     
     }, 10000);


     var redrawSimilar = function() {
      
      var activeRegion = regions[activeRegionSet]
      similarBallotsFiltered = similarBallots.filter(function(d,i){ if($.inArray(d.region_id, activeRegion) > -1) { return d } })


      popSimilar = popContainer.selectAll(".similar")
        .data(similarBallotsFiltered, function(d){return d.country})
        



      var popSimilarEnter = popSimilar.enter().append("g")
        .attr("class", "similar")
        .attr("transform", function(d,i) {
            var l = projection(d.loc)
            return "translate(" + l[0] + "," + (l[1]-30) + ")"
        })
        .style("opacity", 0)
        .on("mouseover", function(d){ 
          markerTooltipShow(d)
        })
        .on("mousemove", markerTooltipMove)
        .on("mouseout", markerTooltipHide);


      var popSimilarExtension = popSimilarEnter.append("g")
        .attr("transform", function(d,i) {
          return "translate(" + 17 + "," + -62 + ")"
        })
        .on("mouseover", function(d){ 
          markerTooltipShow(d)
        })
        .on("mousemove", markerTooltipMove)
        .on("mouseout", markerTooltipHide);


        popSimilarExtension.append("rect")
        .attr("x", 0)
        .attr("y", 0)
       .attr("width", 115)
       .attr("height", 30)
       .style("fill", "#231f20")


      popSimilarExtension.append("text")
      .attr("class", "viz-map-similar similardemo")
      .attr("dx", function(d,i) { 
        if (current_lang=="ar") { return 82 }
          return 42;
      })
      .attr("dy", 20)
      .style("direction", function(d,i) { 
        if (current_lang=="ar") { return "rtl" };
      })
      .text(function(d) { return genders[d.gender].name + " , " + d.age})

      // popSimilarExtension.append("text")
      // .attr("class", "viz-map-similar similarcountry")
      // .attr("dx", 25)
      // .attr("dy", 35)
      // .text(function(d) {return d.name})

      popSimilarExtension.append("image")
      .attr( "xlink:href", function(d) { return "viz/flags/" + d.country + ".gif" })
      .attr("x", 14)
      .attr("y", 7)
      .attr( "width", 22 )
      .attr( "height", 15 )
      popSimilarExtension.append("svg:title").text(function(d) { d.name})

      
      popSimilarEnter.append("image")
      .attr("xlink:href", "viz/img/marker.png")
      .attr("x", -23)
      .attr("y", -68)
      .attr("width", 47 )
      .attr("height", 68)

      popSimilarEnter.append("circle")
        .attr("cx", 1)
        .attr("cy", -45)
       .attr("r", 20)
       .style("fill", "#fff")

    popSimilarEnter.append("image")
      .attr("xlink:href", function(d,i) { return "http://www.myworld2015.org/assets/img/globes/en_globe_" + d.globe +".png"})
      .attr("x", -19)
      .attr("y", -65)
      .attr("width", 40)
      .attr("height", 40)




      var popSimilarUpdate = d3.transition(popSimilar)
      .attr("transform", function(d,i) {
            var l = projection(d.loc)
            return "translate(" + l[0] + "," + (l[1]) + ")"
        })
      .style("opacity", 1)



      var popSimilarExit = d3.transition(popSimilar.exit())
        .attr("transform", function(d,i) {
        var l = projection(d.loc)
        return "translate(" + l[0] + "," + (l[1]-30) + ")"
      })
      .style("opacity", 0).remove()




     }

     function markerTooltipShow(s) {
      $(".markertooltip").html('')
      var content = []

        for (var i=0; i<6; i++){
          var line = '<li><div class="markerPriorityBox" style="background:'+priorities[s.choices[i]]['item-color']+'">&nbsp;</div><p class="markerPriority">'+ priorities[s.choices[i]]['item-title'] + '</p></li>'
          content.push(line)
        }
        

        $(".markertooltip").append($(
          '<div class="markerdemo clearfix"><img src="viz/flags/' + s.country + '.gif" width="22"><span class="marker-demotext">' + genders[s.gender].name + ',' + s.age + '</span><span class="marker-democountry">'+ s.name  +'</span></div>' +
          '<ul>' + content.join("") + '</ul>'
          ))

        markerTooltip.style("visibility", "visible");
     }
     function markerTooltipMove() {markerTooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")}
     function markerTooltipHide() {
      markerTooltip.style("visibility", "hidden")
    }

     redrawSimilar();
  }

  
  $(".viz-loading-2").fadeOut(300);

}


function postvote_UI() {

    $("#viz-explore-custom form")
    .before($('<h3 class="'+current_lang+'">' + vizmetadata[ 'customize_this_segment' ] + '</h3>'))
    .before($('<img src="viz/img/close.png" id="viz-explore-custom-close">'))
    .append($('<div class="viz-dropdown-wrapper">'+
      '<label for="s-country">' + vizmetadata[ 'region_or_country' ] + '</label>' + 
      '<select id="s-country" class="viz-dropdown">' + 
      '<option value="&country=0">' + vizmetadata[ 'all' ] + '</option>' + 
      '<option value="&hdi=1">' + vizmetadata[ 'custom_dropdown_values' ][0] + '</option>' + 
      '<option value="&hdi=2">' + vizmetadata[ 'custom_dropdown_values' ][1] + '</option>' + 
      '<option value="&hdi=3">' + vizmetadata[ 'custom_dropdown_values' ][2] + '</option>' + 
      '<option value="&hdi=4">' + vizmetadata[ 'custom_dropdown_values' ][3] + '</option>' + 
      '<option value="&continent=1">' + vizmetadata[ 'custom_dropdown_values' ][4] + '</option>' + 
      '<option value="&continent=2">' + vizmetadata[ 'custom_dropdown_values' ][5] + '</option>' + 
      '<option value="&continent=3">' + vizmetadata[ 'custom_dropdown_values' ][6] + '</option>' + 
      '<option value="&continent=4">' + vizmetadata[ 'custom_dropdown_values' ][7] + '</option>' + 
      '<option value="&continent=5">' + vizmetadata[ 'custom_dropdown_values' ][8] + '</option>' + 
      '</select>'))
    .append($('<div class="viz-dropdown-wrapper half"><label for="s-gender">' + vizmetadata[ 'gender' ] + '</label><select id="s-gender" class="viz-dropdown"><option value="&gender=0">' + vizmetadata[ 'all' ] + '</option></select></br>'))
    .append($('<div class="viz-dropdown-wrapper half"><label for="s-age">' + vizmetadata[ 'age_groups' ] + '</label><select id="s-age" class="viz-dropdown"><option value="&age_ub=140">' + vizmetadata[ 'all' ] + '</option><option value="&age_ub=34">' + vizmetadata[ 'age1' ] + '</option><option value="&age_lb=35&age_ub=54">' + vizmetadata[ 'age2' ] + '</option><option value="&age_lb=55">' + vizmetadata[ 'age3' ] + '</option></select></br>'))
    .append($('<br class="clear-fix">'))
    .append($('<a href="#" id="viz-custom"">' + vizmetadata[ 'submit' ] + '</a>'))

    $("#tips")
    .append($('<span id="tip1" class="tooltip1 '+current_lang+'">'+vizmetadata[ 'tip1' ]+"</span>"))
    .append($('<span id="tip2" class="tooltip2 '+current_lang+'">'+vizmetadata[ 'tip2' ]+"</span>"))
    .append($('<span id="tip3" class="tooltip3 '+current_lang+'">'+vizmetadata[ 'tip3' ]+"</span>"))
    .append($('<a href="#" id="viz-change" class="viz-btn btn-primary">'+vizmetadata[ 'change' ]+"</a>"));

    $.each(countries, function(index, item){
      if (index > 0) {
        $("select#s-country").append($('<option value="&country=' + item.id + '">' + item.name + "</option>"));
      }
    });

    $.each(genders, function(index, item){
      if (index > 0) {
        $("select#s-gender").append($('<option value="&gender=' + item.id + '">' + item.name + "</option>"));
      }
    });

    $("a#viz-change").click(function(event) {
      $(".tooltip-custom").fadeIn(300);
      event.preventDefault();
   });       

    $("#hdi-q").append($('<img src="viz/img/qmark.png">'))

    $("#viz-explore-custom-close").click(function (event) {
      $(".tooltip-custom").fadeOut(300);
      event.preventDefault();
    })

    $("#hdi-q, #hdi-q img").hover(function () {
      $(".tooltip3").fadeIn(300);
    },
    function () {
      $(".tooltip3").stop().fadeOut(300);
    });

    $("#s-country").val("&country="+userCountry).attr('selected',true);
    $("#s-gender").val("&gender="+userGender).attr('selected',true);
    $("#s-age").val(userAge).attr('selected',true);


    $("#viz-explore").append($('<div class="clear-fix">'))
}


// ================================================== Results Page

var results_Segments = function (data) {
  var newdata; // Load Custom Segment
  var pad = 0.02;
  var padLarge = [0,5,5,10,10,10,15,15,15,15];

  var margin = {top: 120, right: 0, bottom: 40, left: 0},
    width = 906 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width-496], pad);

  var y = d3.scale.linear()
    .range([0, height]);

  data.forEach(function(d) {
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
  }); 


  x.domain(data.map(function(d) { return d.title; }));
  y.domain([d3.min(data, function(d) { return d3.min(d.values.rankings, function(z) { return z.y0})}), d3.max(data, function(d) { return d3.max(d.values.rankings, function(z) { return z.y0})})])

  var xAxis = d3.svg.axis()
    .scale(x)
    .tickPadding(5)
    .orient("top");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

  var svg = d3.select("#viz-explore-results").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Visualization Header
  svg.append("text")
    .attr("class", "viz-title "+current_lang)
    .attr("y", 0)    
    .attr("x", 0)
    .attr("dy", function(d){
      if(current_lang=="ru") { return -100}
      return -95
    })
    .text(vizmetadata[ 'viz1_title' ]);

  svg.append("text")
    .attr("class", "viz-subtitle "+current_lang)
    .attr("y", 0)
    .attr("x", 0)
    .attr("dy", function(d){
      if(current_lang=="ru") { return -77}
      return -65
    })
    .text(vizmetadata[ 'viz1_subtitle' ]);  

// Segment Titles
  // svg.append("text")
  //     .attr("y", height+30)
  //     .attr("x", x.rangeBand())
  //     .attr("class", "segment-labels")
  //     .text(vizmetadata[ 'location' ]);

  svg.append("text")
    .attr("y", height+30)
    .attr("x", x.rangeBand()*2+10)
    .attr("class", "segment-labels")
    .text(vizmetadata[ 'gender' ]);     

  svg.append("text")
    .attr("y", height+30)
    .attr("x", x.rangeBand()*5)
    .attr("class", "segment-labels")
    .text(vizmetadata[ 'age_groups' ]);  


  svg.append("text")
    .attr("y", height+30)
    .attr("x", x.rangeBand()*8+25)
    .attr("class", "segment-labels")
    .text(vizmetadata[ 'hdi' ]);

// Custom Segment Titles

  svg.append("line")
    .attr("y1", -55)
    .attr("y2", -10)
    .attr("x1", 857)
    .attr("x2", 857)
    .style("stroke", "#ccc")


    var custom_country_text = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -40)
    .attr("dy", 0)
    .attr("x", function(d,i) { 
      return 850 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "start" };
      return "end" 
    })
    .text("");   

  var custom_country = svg.append("image")
    .attr( "xlink:href", "viz/flags/"+1+".gif")
    .attr("y", -55)
    .attr("x", 828)
    .attr( "width", 22 )
    .attr( "height", 15 )

  var custom_country_title = custom_country.append("svg:title")
    .text("")




  var custom_gender = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -25)
    .attr("dy", 0)
    .attr("x", function(d,i) { 
      return 850 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "start" };
      return "end" 
    })
    .text(""); 

  var custom_age = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("dy", -10)
    .attr("x", function(d,i) { 
      return 850 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "start" };
      return "end" 
    })
    .text("");

  var custom_votes_number = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -35)
    .attr("x", function(d,i) { 
      return 864 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "end" };
      return "start" 
    })
    .style("font-weight", "bold")
    .text("");          

  var custom_votes = svg.append("text")
    .attr("class", "viz-custom-segment-labels-votes "+current_lang)
    .attr("y", -22)
    .attr("x", function(d,i) { 
      return 864 
    })
    .style("text-anchor", function(d,i) { 
      if (current_lang=="ar") { return "end" };
      return "start" 
    })
    .text(vizmetadata[ 'votes' ]);  

  
// PRIORITIES LEGEND

var legendPadding = {height: 16, space: 5},
    legendMargin = {top: 30, right: 0, bottom: 0, left: 450};

if (current_lang == "ar") {legendMargin.left = 710};    

var svgLegend = svg.append("g")
    .attr("transform", "translate(" + legendMargin.left + "," + legendMargin.top + ")");

svgLegend.append("text")
    .attr("class", "")
    .attr("y", -legendMargin.top)
    .attr("dy", "20px")
    .attr("x", 0)
    .style("font-size", "24px")
    .text(vizmetadata[ 'priorities' ]);

// svgLegend.append("text")
//     .attr("class", "")
//     .attr("y", 155)
//     .attr("x", 0)
//     .style("font-size", "14px")
//     .text(vizmetadata[ 'other_priorities' ]);  

var legend = svgLegend.selectAll(".legend")
    .data(resultChoices)
    .enter().append("g")
    .attr("class", "legend")
    // .attr("transform", function(d) { return "translate(" + -margin.left +  ",0)"; })
    .on("mouseover", function(d) { return highlight(d)})
    .on("mouseout", function(d) { return highlightOff(d)})

legend
    .append("rect")
    .attr("class", "legendboxback")
    .attr("x", function(d,i) { 
      if (current_lang=="ar") { return -250};
      return 0;
    })
    .attr("y", function(d,i) {
    return i*(legendPadding.space+legendPadding.height)})
    .attr("width", 250)
    .attr("height", legendPadding.space+legendPadding.height)
    .style("fill", "#fff")

legend
    .append("rect")
    .attr("class", "legendbox")
    .attr("x", 0)
    .attr("y", function(d,i) {
        return i*(legendPadding.space+legendPadding.height)
    })
    .attr("width", legendPadding.height)
    .attr("height", legendPadding.height)
    .style("fill", function(d,i) { 
        return priorities[d]['item-color'];
    })
    .style("opacity", function(d,i) { 
        return 1;
    })

legend
    .append("text")
    .attr("y", function(d,i) {
        return i*(legendPadding.space+legendPadding.height)
    })
    .attr("dy", "1em")
    .attr("x", function(d,i) { 
      if (current_lang=="ar") { return -legendPadding.space };
      return legendPadding.space+legendPadding.height 
    })
    .style("font-size", function(d,i) { 
        return "13px";
    })
    .style("fill", function(d,i) { 
        return "#111";
    })
    .text(function(d,i) {return priorities[d]['item-title']});


//  SEGMENT BARS


var seglabels = svg.selectAll(".x.axis")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d,i) { 
        return "translate(" + ( x(d.title) + padLarge[i] + x.rangeBand()/2 ) + ",-5)"; 
    });

    seglabels.append("text")
      .attr("class", "viz-explore-labels "+current_lang)
      .attr("transform", "rotate(-50)")
      .style("font-size", function(d,i) { 
        if(i==0) {return "14px"}
        return "11px";
      })
      .style("font-weight", function(d,i) { 
        if(i==0) {return "bold"}
        return "regular";
      })
      .text(function(d){return d.title})


var seg =  svg.selectAll(".segments")
    .data(data)
    .enter().append("g")
    .attr("class", "segments")
    .attr("transform", function(d,i) { 
        return "translate(" + ( x(d.title) + padLarge[i] ) + ",0)"; 
    });
       
var segrect = seg.selectAll(".pri")
    .data(function(d) { return d.values.rankings; }, function(d) { return d.priid; })

segrect.enter().append("rect")
    .attr("class", function(d, i) { return "pri pri" +i })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { if(y(d.y0)) {return y(d.y0)} else {return 0}; })
    .attr("height", function(d, i) { if(y(d.y1)) {return y(d.y1)} else { return 0 }; })
    .style("fill", function(d,i) { return priorities[d.priid]['item-color']})
    .on("mouseover", function(d) { return highlight(d)})
    .on("mouseout", function(d) { return highlightOff(d)})

segrect.exit().remove();

seg.selectAll(".pritext")
    .data(function(d) { return d.values.rankings; })
    .enter().append("text")
    .attr("class", "pritext")
    .attr("x", x.rangeBand()/2)
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
    .on("mouseover", function(d) { return highlight(d)})
    .on("mouseout", function(d) { return highlightOff(d)})


function highlight(selected){
  if(selected.priid) { selected = selected.priid}

  d3.selectAll(".pri")
    .filter(function(d) { return d.priid == selected; })

  d3.selectAll(".pritext")
    .filter(function(d) { return d.priid == selected; })
    .style("display", "block");

  d3.selectAll(".pri")
    .filter(function(d) { return d.priid != selected; })
    .style("opacity", .2)

  d3.selectAll(".legend")
    .filter(function(d) { return d != selected; })
    .style("opacity", .2)
}

function highlightOff(selected){
  d3.selectAll(".pri, .legend")
    .style("opacity", 1)

  d3.selectAll(".pritext").style("display", "none")
}

function callCustom(){
  var s_country = $('select#s-r-country').val();
  var s_gender = $('select#s-r-gender').val(); 
  var s_age = $('select#s-r-age').val(); 

  var customCall = api+"segment?"+s_country+s_gender+s_age;
  $.getJSON(customCall, function(ndata) { 

  custom_votes_number.text(coma(ndata.tVotes));      
  newdata = ndata.rankings
  var m = 0;
  var t = ndata.tVotes*6;
  newdata.forEach(function(d,i) {
      var p = parseFloat(d["count"]/t);
      d["y1"] = p;
      d["y0"] = m;
      d["priid"] = d["id"]
      m += p;
    });

  d3.transition()
    .duration(750)
    .each(redraw);
  })

  var ccode = s_country.substring(9)
  ccode = parseInt(ccode);

  if(ccode == 0 || isNaN(ccode)) {
    custom_country.style("opacity", 0)
    custom_country_text.style("opacity", 1)
    custom_country_text.text($('#s-r-country>option:selected').text())
  }

  else if (ccode >0) {
    custom_country.style("opacity", 1)
    custom_country_text.style("opacity", 0)
    custom_country.attr("xlink:href", "viz/flags/"+s_country.substring(9)+".gif")
    custom_country_title.text($('#s-r-country>option:selected').text())
  }

  custom_gender.text($('#s-r-gender>option:selected').text()); 
  custom_age.text($('#s-r-age>option:selected').text());
}


function redraw(){
    var scxpos =840;
    var sc = svg.selectAll(".sc")
      .data(newdata, function(d) { return d.priid; })

    var scEnter = sc.enter().insert("g", ".axis")
      .attr("class", "sc")
      .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
      .style("fill-opacity", 0);

      scEnter.append("rect")
      .attr("class", function(d, i) { return "pri pri" +i })
      .attr("width", x.rangeBand())
      .attr("height", function(d) { return y(d.y1)})
      .style("fill", function(d,i) { return priorities[d.priid]['item-color']})
      .on("mouseover", function(d) { return highlight(d)})
      .on("mouseout", function(d) { return highlightOff(d)});

      // scEnter.append("svg:image")
      // .attr("class", function(d, i) { return "pri pri" +i })
      // .attr( "xlink:href", function(d) {
      //   if (userChoices.indexOf(parseInt(d.priid)) < 6 ) { return "assets/icons/ballot/check.png";}
      //   return null })
      // .attr("transform", function(d){ return "translate(" + (x.rangeBand() * 0.8) + "," + (y(d.y1)/2 - 13) + ")"})
      // .attr( "width", 20 )
      // .attr( "height", 15 )
      // .attr("opacity", 0);

      scEnter.append("text")  
      .attr("class", "pritext")
      .attr("x", x.rangeBand()/2)
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
      .on("mouseover", function(d) { return highlight(d)})
      .on("mouseout", function(d) { return highlightOff(d)})


       var scUpdate = d3.transition(sc)
      .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
      .style("fill-opacity", 1);

      scUpdate.select("rect")
      .attr("height", function(d) { return y(d.y1)})

      // scUpdate.select("image")
      // .attr("opacity", 1)

      scUpdate.select("text")
      .text(function(d,i) { return "#"+(i+1)})

      var scExit = d3.transition(sc.exit())
            .attr("transform", function(d) { return "translate(" + scxpos + "," + y(d.y0) + ")"; })
            .style("fill-opacity", 0)
            .remove();

        scExit.select("rect")
          .attr("height", function(d) { return y(d.y0)});

        // scExit.select("image")
        //   .attr("opacity", 0);
 }

  // CUSTOM SEGMENT CALL

  $("a#viz-custom-results").click(function(event) {
      event.preventDefault();
      callCustom();
      $(".tooltip-custom").fadeOut(300);
   });   
   
  callCustom();  

}

function results_Map() {    
  var format = d3.time.format("%Y-%m-%d");
  var eDate = new Date(mapTime*1000);
  var country;
  var pick = userCountry;  
  var mapScale = 175;
  var zoomLevel = 1;


  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  var maxVotes = d3.max(mapStats, function(d){ return d.tVotes})
  maxVotes = roundTo(maxVotes,10000)

  colorFill.domain([maxVotes, 100 , 0])

  var m = [0, 0, 0, 0],
      w = 896,
      h = 650

  // Mercator Projection Settings
  var projection = d3.geo.eckert3()
      .scale([mapScale])
      .translate([w/2,h/2+40]);

  var path = d3.geo.path()
      .projection(projection);

  var zoom = d3.behavior.zoom()
      .translate(projection.translate())
      .scale(projection.scale())
      .scaleExtent([mapScale, 16 * mapScale])
      .on("zoom", move);


  var map = d3.select("#viz-map-results").append("svg:svg")
      .attr("width", w + m[1] + m[3])
      .attr("height", h - m[0] + m[2])
      .attr("pointer-events", "all")
      .append("svg:g")
      .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
      .on("dblclick", null)
      .call(zoom)

      map.append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w + m[1] + m[3])
        .attr("height", h + m[0] + m[2])
        .style("fill", "#fff")

    worldmap.forEach(function(d){
      var cid = $.grep(countryList, function(num, index) { return num.name == d.properties.name })
      if (cid.length>0) {
        d.properties.cid = cid[0].id 
        var votes = $.grep(mapStats, function(num, index) { return num.country == cid[0].id })
        if(votes.length>0) { 
          d.votes = votes[0].tVotes 
        }
        else {d.votes = 0}  
      }
      else { 
        d.properties.cid = 0; 
        d.votes = -1;
      }
    })

  map.append("svg:g")
  country = map.selectAll(".country")
      .data(worldmap)
    .enter().append("svg:path").attr("d", path);



  var cNames = map.selectAll(".country")
      .data(worldmap)
      .enter().append("svg:text")
      .filter(function (d){return d.properties.cid > 0  })
    .attr("transform", function(d,i) {
      var l = projection(d.properties.loc)
      return "translate(" + l[0] + "," + l[1] + ")"
    })
    .style("text-anchor", "middle")
    .style("font-size", "9px")
    .style("fill", "#111")
    .style("opacity", 0)
    .style("display","none")
    .text(function(d) { 
      var cname = $.grep(countries, function(num, index) {return num.id == d.properties.cid })
      return cname[0].name; });



  var zoomButtons = map.append("g");

    zoomButtons.append("image")
    .attr("class", "zoom-buttons")   
    .attr( "xlink:href", "viz/img/zoom.png")
    .attr("y", 60)
    .attr("x", w-60)
    .attr( "width", 29 )
    .attr( "height", 58);

    zoomButtons.append("rect")
    .attr("class", "zoom-buttons")   
    .attr("x", w-60)
    .attr("y", 60)
    .attr( "width", 30)
    .attr( "height", 30)
    .style("fill", "#fff")
    .style("opacity", 0)
    .on("click", zoomIn)

    zoomButtons.append("rect")
    .attr("class", "zoom-buttons")   
    .attr("x", w-60)
    .attr("y", 90)
    .attr( "width", 30)
    .attr( "height", 30)
    .style("fill", "#fff")
    .style("opacity", 0)
    .on("click", zoomOut)


  country
    // .attr("class", function(d){ if (d.properties.cid==pick) { return "picked"} })
    .style("fill", function(d){      
      // if (d.properties.cid==pick) { return "#333"}
      return colorFill(d.votes)
      })
     // .on("click", click)
    .call(d3.helper.tooltip(function(d, i){
        var cname = $.grep(countries, function(num, index) {return num.id == d.properties.cid })
        if (d.properties.cid){
        return "<span><strong>" + cname[0].name + " </strong><br> " + vizmetadata['votes'] +": " + coma(d.votes) +"</span>";
        }
        return null
      }));    


    // country.append("svg:title").text(function(d) { return d.properties.name; });



// Visualization Header
  map.append("rect")
    .attr("y", 0)    
    .attr("x", 0)
    .attr("width", w)
    .attr("height", 40)
    .style("fill", "#FFFFFF")
    .style("opacity", .5)

  map.append("text")
    .attr("class", "viz-title "+current_lang)
    .attr("y", 5)    
    .attr("x", 5)
    .attr("dy", 25)
    .text(vizmetadata[ 'viz2_title_results' ]);

  // map.append("text")
  //   .attr("x", 0)
  //   .attr("y", 0)
  //   .attr("dy", 55)
  //   .style("text-anchor", "start")
  //   .style("font-size", "24px")
  //   .style("fill", "#666")
  //   .text(vizmetadata[ 'viz2_subtitle' ]);  

  map.append("text")
    .attr("class", "viz-map-date "+current_lang)
    .attr("x", w)
    .attr("y", h)
    .attr("dy", -5)
    .text(vizmetadata[ 'country_totals' ] +  eDate);    


// Map Legend

var legendpad = 24; // Legend Padding
var legendsize = 18; // Legend Box Size

  map.append("rect")
    .attr("y", h-legendpad*5)    
    .attr("x", 0)
    .attr("width", legendpad*5)
    .attr("height", legendpad*5)
    .style("fill", "#FFFFFF")
    .style("opacity", .5)

var legend = map.selectAll(".legend")
    .data(colorFill.domain())
    .enter().append("g")
    .attr("transform", "translate(" + legendpad + "," + (h-legendpad*4) + ")")

    legend.append("rect")
      .attr("y", function (d,i) {
        if (i>1) { i = 5}
        return i*legendpad})
      .attr("x", 0)
      .attr("height", legendsize)
      .attr("width", legendsize)
      .style("fill", function (d,i) {return colorFill(d)})
      .style("stroke", "#ddd");

    legend.append("text")
      .attr("class", "viz-map-legend "+current_lang)
      .attr("y", function (d,i) {
        if (i==0) { return 0 }
        else if (i==1) { return legendsize*3 }
        else if (i==2) { return legendpad*3+10 }}
        )
      .attr("x", 0)
      .attr("dx", legendsize+8)
      .attr("dy", 4)
      .text(function (d,i) {
          if (d == 0) {return vizmetadata['none']}
          return "~" + coma(d);
          })

var gradient = map.append("svg:defs")
  .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "0%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", colorFill.range()[0])
    .attr("stop-opacity", 1);

gradient.append("svg:stop")
    .attr("offset", "80%")
    .attr("stop-color", colorFill.range()[1])
    .attr("stop-opacity", 1);

  legend.append("svg:rect")
    .attr("y", 0)
    .attr("x", 0)
    .attr("width", legendsize)
    .attr("height", legendsize*3)
    .style("fill", "url(#gradient)");

    legend.append("svg:rect")
    .attr("y", legendpad*3)
    .attr("x", 0)
    .attr("width", legendsize)
    .attr("height", legendsize)
    .style("stroke-width", "0.5px")
    .style("stroke", "#999")
    .style("fill", "#fff");  


  function zoomIn(){
    zoomLevel++;
    movePaths(zoomLevel);
  }

  function zoomOut(){
    zoomLevel--;
    movePaths(zoomLevel);
  }

  function move() {
    // console.log("pos: " + d3.event.translate)
    // console.log("zoom: " + d3.event.scale)

    zoomLevel = d3.event.scale/mapScale
    
    var t = d3.event.translate,
      s = d3.event.scale;
      t[0] = Math.max(-s*2, Math.min(w + s*2, t[0]));
      t[1] = Math.max(-s*2, Math.min(h + s*2, t[1]));
      // t[0] = Math.max(-t[0]*z, t[0]*z);
      // t[1] = Math.max(-t[1]*z, t[1]*z);
      // console.log(t)
      zoom.translate(t).scale(s);
      projection.translate(t).scale(s);

    // Show / Hide Country Names
    if (zoomLevel>4) {
      cNames.transition()
      .style("opacity",1)
      .style("display","block")
    }

    else if (zoomLevel<4) {
      cNames.transition()
      .style("opacity",0)
      .style("display","none")
    }

    country.attr("d", path);
    cNames.attr("transform", function(d,i) {
      var l = projection(d.properties.loc)
      return "translate(" + l[0] + "," + l[1] + ")"
    })
  }

  function movePaths(zoomLevel){
    if (zoomLevel<1) {zoomLevel=1}
    if (zoomLevel>10) {zoomLevel=10}

    var s = zoomLevel*mapScale,
    t = projection.translate();
    // zoom.translate(t).scale(s);
    // projection.translate(t).scale(s);

    zoom.scale(s);
    projection.scale(s);

    country.transition().duration(500).attr("d", path);
    if (zoomLevel>=4) {
      console.log(zoomLevel)
      cNames.transition().duration(500)
      .attr("transform", function(d,i) {
        var l = projection(d.properties.loc)
        return "translate(" + l[0] + "," + l[1] + ")"
      })
      .style("opacity",1)
      .style("display","block")
    }

    else if (zoomLevel<4) {
      cNames.transition().duration(500)
      .style("opacity",0)
      .style("display","none")
    }
      
    
  }


   $(".viz-loading").fadeOut(300);

}




function results_UI() {

    $("#viz-explore-custom-results form")
    .before($('<h3 class="'+current_lang+'">' + vizmetadata[ 'customize_this_segment' ] + '</h3>'))
    .before($('<img src="viz/img/close.png" id="viz-explore-custom-results-close">'))
    .append($('<div class="viz-dropdown-wrapper">'+
      '<label for="s-r-country">' + vizmetadata[ 'region_or_country' ] + '</label>' + 
      '<select id="s-r-country" class="viz-dropdown">' + 
      '<option value="&country=0">' + vizmetadata[ 'all' ] + '</option>' + 
      '<option value="&hdi=1">' + vizmetadata[ 'custom_dropdown_values' ][0] + '</option>' + 
      '<option value="&hdi=2">' + vizmetadata[ 'custom_dropdown_values' ][1] + '</option>' + 
      '<option value="&hdi=3">' + vizmetadata[ 'custom_dropdown_values' ][2] + '</option>' + 
      '<option value="&hdi=4">' + vizmetadata[ 'custom_dropdown_values' ][3] + '</option>' + 
      '<option value="&continent=1">' + vizmetadata[ 'custom_dropdown_values' ][4] + '</option>' + 
      '<option value="&continent=2">' + vizmetadata[ 'custom_dropdown_values' ][5] + '</option>' + 
      '<option value="&continent=3">' + vizmetadata[ 'custom_dropdown_values' ][6] + '</option>' + 
      '<option value="&continent=4">' + vizmetadata[ 'custom_dropdown_values' ][7] + '</option>' + 
      '<option value="&continent=5">' + vizmetadata[ 'custom_dropdown_values' ][8] + '</option>' + 
      '</select>'))
    .append($('<div class="viz-dropdown-wrapper half"><label for="s-r-gender">' + vizmetadata[ 'gender' ] + '</label><select id="s-r-gender" class="viz-dropdown"><option value="&gender=0">' + vizmetadata[ 'all' ] + '</option></select></br>'))
    .append($('<div class="viz-dropdown-wrapper half"><label for="s-r-age">' + vizmetadata[ 'age_groups' ] + '</label><select id="s-r-age" class="viz-dropdown"><option value="&age_ub=140">' + vizmetadata[ 'all' ] + '</option><option value="&age_ub=34">' + vizmetadata[ 'age1' ] + '</option><option value="&age_lb=35&age_ub=54">' + vizmetadata[ 'age2' ] + '</option><option value="&age_lb=55">' + vizmetadata[ 'age3' ] + '</option></select></br>'))
    .append($('<br class="clear-fix">'))
    .append($('<a href="#" id="viz-custom-results"">' + vizmetadata[ 'submit' ] + '</a>'))

    $("#tips-results")
    .append($('<span id="tip1-results" class="tooltip1 '+current_lang+'">'+vizmetadata[ 'tip1' ]+"</span>"))
    .append($('<span id="tip2-results" class="tooltip2 '+current_lang+'">'+vizmetadata[ 'customize' ]+"</span>"))
    .append($('<span id="tip3-results" class="tooltip3 '+current_lang+'">'+vizmetadata[ 'tip3' ]+"</span>"))
    .append($('<a href="#" id="viz-change-results" class="viz-btn btn-primary">'+vizmetadata[ 'change' ]+"</a>"));

    $.each(countries, function(index, item){
      if (index > 0) {
        $("select#s-r-country").append($('<option value="&country=' + item.id + '">' + item.name + "</option>"));
      }
    });

    $.each(genders, function(index, item){
      if (index > 0) {
        $("select#s-r-gender").append($('<option value="&gender=' + item.id + '">' + item.name + "</option>"));
      }
    });

    $("a#viz-change-results").click(function(event) {
      $(".tooltip-custom").fadeIn(300);
      event.preventDefault();
   });       

    $("#hdi-q-results").append($('<img src="viz/img/qmark.png">'))

    $("#viz-explore-custom-results-close").click(function (event) {
      $(".tooltip-custom").fadeOut(300);
      event.preventDefault();
    })

    $("#hdi-q-results, #hdi-q-results img").hover(function () {
      $(".tooltip3").fadeIn(300);
    },
    function () {
      $(".tooltip3").stop().fadeOut(300);
    });

    $("#s-r-country").val("&country="+resultCountry).attr('selected',true);
    $("#s-r-gender").val("&gender="+resultGender).attr('selected',true);
    $("#s-r-age").val(resultAge).attr('selected',true);

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