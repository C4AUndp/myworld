var current_lang = 'default';


// =========================== User Vars
var metadata = 'assets/data/' + current_lang + '.json';
var goodCountries = [24, 30, 53, 181, 185, 183, 66, 134, 88, 159, 96, 77, 61, 78, 110, 161, 31, 151, 36, 16, 193, 65, 170, 83, 177, 136, 7, 121, 37, 138, 17, 141]
var resultCountry = goodCountries[Math.floor(Math.random() * goodCountries.length)];
var resultGender = 0;
var resultAge = "&age_ub=34";
var resultChoices = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
var resultChoices_others = [1,2,3,4,5,6];



// API VARS
// var api = "http://clients.seedvisualization.com/api/myworld/public/";
var api = "http://54.227.246.164/stats/public/";
var urlList = "assets/data/default.json";
var urlMap = "viz/worldmap.json";
var urlStats = "http://54.227.246.164/static/map_stats2.json";
var urlSegments = "http://54.227.246.164/static/segment_comparison2.json";
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
  getVizmetadata();
})

var getVizmetadata = function(){ 
                      $.getJSON(metadata, function(lang) {
                        vizmetadata = lang.viz;
                        countries = lang.fields_values.countries;
                        genders = lang.fields_values.gender;
                        educations = lang.fields_values.education;
                        priorities = lang.accordion_items;                       
                        getSegments();
                      })}
              

var getSegments = function(){ 
                      $.getJSON(urlSegments, function(data) { 
                        segments = data;
                        ready();
                      })}




function ready() {

  segments = [
    {title: vizmetadata[ 'world' ], values:segments['total']}
  ]
  
  results_UI();
  results_Segments(segments);  
}



// ================================================== Results Page

var results_Segments = function (data) {
  var newdata; // Load Custom Segment
  var pad = 0.02;
  var padLarge = [0,5,5,10,10,10,15,15,15,15];

  var margin = {top: 50, right: 0, bottom: 0, left: 0},
    width = 50 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], pad);

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

  var svg = d3.select("#viz-explore-results2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Custom Segment Titles

  // svg.append("line")
  //   .attr("y1", -55)
  //   .attr("y2", -10)
  //   .attr("x1", 50)
  //   .attr("x2", 50)
  //   .style("stroke", "#ccc")


  //   var custom_country_text = svg.append("text")
  //   .attr("class", "viz-custom-segment-labels "+current_lang)
  //   .attr("y", -40)
  //   .attr("dy", 0)
  //   .attr("x", function(d,i) { 
  //     return 850 
  //   })
  //   .style("text-anchor", function(d,i) { 
  //     if (current_lang=="ar") { return "start" };
  //     return "end" 
  //   })
  //   .text("");   

  // var custom_country = svg.append("image")
  //   .attr( "xlink:href", "viz/flags/"+1+".gif")
  //   .attr("y", -55)
  //   .attr("x", 828)
  //   .attr( "width", 22 )
  //   .attr( "height", 15 )

  // var custom_country_title = custom_country.append("svg:title")
  //   .text("")

  // var custom_gender = svg.append("text")
  //   .attr("class", "viz-custom-segment-labels "+current_lang)
  //   .attr("y", -25)
  //   .attr("dy", 0)
  //   .attr("x", function(d,i) { 
  //     return 50 
  //   })
  //   .style("text-anchor", function(d,i) { 
  //     if (current_lang=="ar") { return "start" };
  //     return "end" 
  //   })
  //   .text(""); 

  // var custom_age = svg.append("text")
  //   .attr("class", "viz-custom-segment-labels "+current_lang)
  //   .attr("dy", -10)
  //   .attr("x", function(d,i) { 
  //     return 50 
  //   })
  //   .style("text-anchor", function(d,i) { 
  //     if (current_lang=="ar") { return "start" };
  //     return "end" 
  //   })
  //   .text("");

  var custom_votes_number = svg.append("text")
    .attr("class", "viz-custom-segment-labels "+current_lang)
    .attr("y", -23)
    .attr("x", function(d,i) { 
      return 25 
    })
    .style("text-anchor", function(d,i) { 
      return "middle" 
    })
    .style("font-weight", "bold")
    .text("");          

  // var custom_votes = svg.append("text")
  //   .attr("class", "viz-custom-segment-labels-votes "+current_lang)
  //   .attr("y", -22)
  //   .attr("x", function(d,i) { 
  //     return 50 
  //   })
  //   .style("text-anchor", function(d,i) { 
  //     if (current_lang=="ar") { return "end" };
  //     return "start" 
  //   })
  //   .text(vizmetadata[ 'votes' ]);  



function callCustom(){
  var s_country = $('select#s-r-country2').val();
  var s_gender = $('select#s-r-gender2').val(); 
  var s_age = $('select#s-r-age2').val(); 

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

  // var ccode = s_country.substring(9)
  // ccode = parseInt(ccode);

  // if(ccode == 0 || isNaN(ccode)) {
  //   custom_country.style("opacity", 0)
  //   custom_country_text.style("opacity", 1)
  //   custom_country_text.text($('#s-r-country>option:selected').text())
  // }

  // else if (ccode >0) {
  //   custom_country.style("opacity", 1)
  //   custom_country_text.style("opacity", 0)
  //   custom_country.attr("xlink:href", "assets/img/flags/"+s_country.substring(9)+".gif")
  //   custom_country_title.text($('#s-r-country>option:selected').text())
  // }

  // custom_gender.text($('#s-r-gender>option:selected').text()); 
  // custom_age.text($('#s-r-age>option:selected').text());
}


function redraw(){
    var scxpos =0;
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
      .call(d3.helper.tooltip(function(d, i){
            // var tcolor = d3.rgb(priorities[d.id]['item-color']).brighter(2)
            var tcolor = "#fff"
            if (d.pri_id == 15 || d.pri_id == 16 || d.pri_id == 6){
            tcolor = "#111"
          }
              return "<div style='text-align:center;color:"+tcolor+";background:"+priorities[d.priid]['item-color']+"'><span class='b'>" + priorities[d.priid]['item-title'] + " </span><br /> (" + coma(d.count) +  ")</div>";
          }))
      // .on("mouseover", function(d) { return highlight(d)})
      // .on("mouseout", function(d) { return highlightOff(d)});


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
      // .on("mouseover", function(d) { return highlight(d)})
      // .on("mouseout", function(d) { return highlightOff(d)})


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

  $("a#viz-custom-results2").click(function(event) {
      event.preventDefault();
      callCustom();
   });   
   
  callCustom();  

}





function results_UI() {

    $("#viz-explore-custom-results2 form")
    // .before($('<label class="'+current_lang+'">' + vizmetadata[ 'customize_this_segment' ] + '</label>'))
    .append($('<div class="viz-dropdown-wrapper2">'+
      // '<label for="s-r-country">' + vizmetadata[ 'region_or_country' ] + '</label>' + 
      '<select id="s-r-country2" class="viz-dropdown">' + 
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
    // .append($('<div class="viz-dropdown-wrapper half"><label for="s-r-gender">' + vizmetadata[ 'gender' ] + '</label><select id="s-r-gender" class="viz-dropdown"><option value="&gender=0">' + vizmetadata[ 'all' ] + '</option></select></br>'))
    // .append($('<div class="viz-dropdown-wrapper half"><label for="s-r-age">' + vizmetadata[ 'age_groups' ] + '</label><select id="s-r-age" class="viz-dropdown"><option value="&age_ub=140">' + vizmetadata[ 'all' ] + '</option><option value="&age_ub=34">' + vizmetadata[ 'age1' ] + '</option><option value="&age_lb=35&age_ub=54">' + vizmetadata[ 'age2' ] + '</option><option value="&age_lb=55">' + vizmetadata[ 'age3' ] + '</option></select></br>'))
    .append($('<div class="viz-dropdown-wrapper2 half"><select id="s-r-gender2" class="viz-dropdown"><option value="&gender=0">' + vizmetadata[ 'all' ] + '</option></select></br>'))
    .append($('<div class="viz-dropdown-wrapper2 half"><select id="s-r-age2" class="viz-dropdown"><option value="&age_ub=140">' + vizmetadata[ 'all' ] + '</option><option value="&age_ub=34">' + vizmetadata[ 'age1' ] + '</option><option value="&age_lb=35&age_ub=54">' + vizmetadata[ 'age2' ] + '</option><option value="&age_lb=55">' + vizmetadata[ 'age3' ] + '</option></select></br>'))
    .append($('<a href="#" class="btn btn-default" id="viz-custom-results2"">Change</a>'))


    $.each(countries, function(index, item){
      if (index > 0) {
        $("select#s-r-country2").append($('<option value="&country=' + item.id + '">' + item.name + "</option>"));
      }
    });

    $.each(genders, function(index, item){
      if (index > 0) {
        $("select#s-r-gender2").append($('<option value="&gender=' + item.id + '">' + item.name + "</option>"));
      }
    });    

    $("#s-r-country2").val("&country="+resultCountry).attr('selected',true);
    $("#s-r-gender2").val("&gender="+resultGender).attr('selected',true);
    $("#s-r-age2").val(resultAge).attr('selected',true);

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
                .style('top', (absoluteMousePos[1] - 5)+'px')
                .style('position', 'absolute') 
                .style('z-index', 999999)

            // Add text using the accessor function
            var tooltipText = accessor(d, i) || '';

            // Crop text arbitrarily
            tooltipDiv
              // .style('width', function(d, i){return (tooltipText.length > 80) ? '300px' : null;})
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

