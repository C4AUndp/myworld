
var color = d3.scale.ordinal()
		.range(["#FF8000", "#f30", "#DF3A01", "#a05d56", "#B43104"]);

$(function(){

var list = "assets/data/default.json"
// var api = "http://clients.seedvisualization.com/api/myworld/"
var api = "http://54.227.246.164/stats/";
var partnerlist = api + "partner_rankings"
var countries, priorities, partners;
var sources = [{name:"Website",id:1},{name:"Ballot",id:2},{name:"SMS",id:3}]
var hdi = ["low","medium", "high", "veryhigh"]
var sCountry;
var donutData;
var ageVal;

// TIME VARS
var dateLabel = d3.time.format("%d-%m")
var daysUrl = d3.time.format("%Y-%m-%d")
var today = new Date();
var lastWeek = new Date(today.getTime()-1000*60*60*24*14);
var beginning;

$("#tseries-container").hide();
// Analyze the ID for calling the API
var getId = function (p) {
	$("#s-country").hide();
	
	$("#pTable").hide();
	$("#backtoall").show();
	// For Country Parameters
	if (p.country) {
		var m = $.grep(countries, function(e) { return e.name == p.country });
		var xapi = api + "country?id=" + m[0].id;
    var tapi = api + "tseries/" + daysUrl(today) + "/" + daysUrl(lastWeek) + "?country=" + m[0].id;

		// console.log(parseInt(m[0].id) + 35)
		$("select#s-country")[0].selectedIndex = parseInt(m[0].id) + 35 ;
		callAPI(xapi)
		
		var sapi = api + "segment?country=" + m[0].id;
		callSegment(sapi);
		// calltSeries(tapi)


		$("#current").text(p.country)
	}

	// For Partner Parameters
	else if (p.partner) {
		var m = $.grep(partners, function(e) { return e.volunteer_id == p.partner });
		var id = m.volunteer_id;
		var xapi = api + "partner?id=" + p.partner;
		callAPI(xapi)
		console.log(xapi)
		var sapi = api + "segment?partner=" + p.partner;
		callSegment(sapi);
		


		$("#current").text(m[0].organization)
	}

	// For Source Parameters
	else if (p.source) {
		var m = $.grep(sources, function(e) { return e.name == p.source });
		var xapi = api + "sourceMethod?id=" + m[0].id;
		callAPI(xapi)

		var sapi = api + "segment?sourceMethod=" + m[0].id;
		callSegment(sapi);
		
		$("#current").text(p.source)
	}

	// All others & unknown call direct API
	else {
		var sapi = api + "segment?";
		var tapi = api + "tseries/" + daysUrl(today) + "/" + daysUrl(lastWeek);
		callAPI(api)
		calltSeries(tapi);
		callSegment(sapi);
		
		$("#current").text("All")
		$("#backtoall").hide();
		$("#s-country").show();
		$("#pTable").show();
	}
}

var callAPI = function (api) {
	$.getJSON(api, function(jdata) {
		$("#loadingd").show();
		donuts(jdata);
		totals(jdata.tVotes);

    console.log(jdata)

    var eDate = new Date(jdata.computed_at*1000)

		$('#update').html('Data Last Updated<br>'+eDate); 
		
		if(jdata.countries) {
			cTable(jdata);
		}
		if(!jdata.countries) {
			$("#cTable").fadeOut();
		}
		$("#loadingd").fadeOut();
	});
}

var callSegment = function (api) {
	$.getJSON(api, function(jdata) {
		$("#loadings").show();
		segmentBar(api, jdata);
		callAllsegments(api);
	});
}

var callAllsegments = function (api) {
	var segments = []; 
	var s = api;
	var url = [
		{name:"Male",order:1,url:s+"&gender=1"},
		{name:"Female",order:2,url:s+"&gender=2"},
		{name:"Some Prim.",order:6,url:s+"&education=1"},
		{name:"Finished Prim.",order:7,url:s+"&education=2"},
		{name:"Finished Secondary",order:8,url:s+"&education=3"},
		{name:"Beyond Secondary",order:9,url:s+"&education=4"},
		{name:"≤34",order:3,url:s+"&age_ub=34"},
		{name:"35-54",order:4,url:s+"&age_lb=35&age_ub=54"},
		{name:"≥55",order:5,url:s+"&age_lb=55"}
	];


	if (s.substring(57,64) != "country"){
		url.push(
			{name:"Low HDI",order:10,url:s+"&hdi=1"},
			{name:"Medium HDI",order:11,url:s+"&hdi=2"},
			{name:"High HDI",order:12,url:s+"&hdi=3"},
			{name:"Very High HDI",order:13,url:s+"&hdi=4"}
			)
	}

	var jqXHRs = $(url).map(function() { 
		var x = this.name;
		var o = this.order;
		return $.getJSON(this.url, function(data) {
			data["title"] = x;
			data["order"] = o;
			segments.push(data)	
		});

	});
	
	$.when.apply(null, jqXHRs.get()).done(
		function() {

			
			// console.log(segments)
		    segmentSummary(segments)
		}	
	);
}


var totals = function (total) {
	$("#total").html('');

	var counterholder = $("#total");
	var counter = total.toString().split('');

	for (var i=0; i<7-counter.length; i++){
		counterholder.append($('<span class="count">&nbsp;</span>'));
	}

	$.each(counter, function(index, item){
		counterholder.append($('<span class="count">'+item+'</span>'));
	});
}


var calltSeries = function (api) {
	$("#tseries-container").show();
	$.getJSON(api, function(jdata) {
		tseries(jdata.dates);
	});

}


var tseries = function (data) {

var percent = d3.format("%");
var parseDate = d3.time.format("%Y-%m-%d").parse;


var genderlist = ["N/A", "Male", "Female"]
var hdilist = ["N/A", "Low HDI", "Medium HDI", "High HDI", "Very High HDI"]
var edulist = ["N/A", "Some Primary", "Finished Primary", "Finished Secondary", "Beyond Secondary"]


  var raw =[];
  var rawrec =[];
  var rawtotal =[];


    data.forEach(function(k){

      k.date = parseDate(k.date)
      if (k.tVotes == 0) { k.tVotes = 0.001}

      var rec = {
            "key": "total",
            "date":k.date,
            "value":k.tVotes
        }

        
        rawtotal.push(rec)

    });


    data.forEach(function(k){
      k.gender.forEach(function(d){

        var rec = {

            "key": genderlist[d._id],
            "cat": "gender",
            "date":k.date,
            "value":d.count
        }
        // if (!rec.key) {rec.key = genderlist[0]}
        if (rec.key) {raw.push(rec)}
      });
      k.education.forEach(function(d){
        var rec = {
            "key": edulist[d._id],
            "cat": "edu",
            "date":k.date,
            "value":d.count
        }
        // if (!rec.key) {rec.key = edulist[0]}
        if (rec.key) {raw.push(rec)}

      });
      k.hdi.forEach(function(d){
        var rec = {
            "key": hdilist[d._id],
            "cat": "hdi",
            "date":k.date,
            "value":d.count
        }
        // console.log(rec)
        if (rec.key) {raw.push(rec)}

      });

      k.recs.forEach(function(d){

          var rec = {
            "key": "rec_"+d._id,
            "rec": d._id,
            "date":k.date,
            "value":d.count/k.tVotes,
            "valueabs":d.count
        }

        rawrec.push(rec)

        })


    });


    

var margin = {top: 20, right: 15, bottom: 40, left: 40},
   width = 940 - margin.left - margin.right,
   height = 710 - margin.top - margin.bottom;

var padding = 20;

var stack = d3.layout.stack()
    .offset("zero")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var stack2 = d3.layout.stack()
    .offset("expand")
    .values(function(d) { return d.values; })
    .x(function(d) { return d.date; })
    .y(function(d) { return d.value; });

var nest = d3.nest()
    .key(function(d) { return d.key; });

var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y3(d.y0); })
    .y1(function(d) { return y3(d.y0 + d.y); });

var area2 = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y0(function(d) { return y2(d.y0); })
    .y1(function(d) { return y2(d.y0 + d.y); });

var line = d3.svg.line()
    .interpolate("cardinal")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.y); });  


  var x = d3.time.scale()
    .range([10, width-10]);

  var y3 = d3.scale.linear()
    .range([120, 0]);

  var y2 = d3.scale.linear()
      .range([290,170]);

  var y = d3.scale.linear()
      .range([640, 340]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .ticks(d3.time.days)
      .tickSize(-height)
      .orient("bottom");

  var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(4)
      .tickFormat(percent)
      .orient("left");

  var yAxis2 = d3.svg.axis()
      .scale(y2)
      .ticks(4)
      .tickFormat(percent)
      .orient("left");

  var yAxis3 = d3.svg.axis()
      .scale(y3)
      .ticks(4)
      .orient("left");



  var totalv = stack(nest.entries(rawtotal));
  var rLines = stack(nest.entries(rawrec));


  x.domain(d3.extent(raw, function(d) { return d.date; }));
  y.domain([0, d3.max(rawrec, function(d) { return d.value; })])
  y3.domain([0, d3.max(rawtotal, function(d) { return d.y0 + d.y; })])


var svg = d3.select("#tseries").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .style("fill", "#fff")


      svg.append("text")
      .attr("class", "sections")
      .attr("x", 30)
      .attr("y", -5)
      .attr("dx", "-15px")
      .attr("dy", "-5px")
      // .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#000")
      .text("Total Ballots");


      svg.append("text")
      .attr("class", "sections")
      .attr("x", 30)
      .attr("y", 168)
      .attr("dx", "-15px")
      .attr("dy", "-5px")
      // .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#000")
      .text("Distribution of ");

      svg.append("text")
      .attr("class", "sections")
      .attr("x", 30)
      .attr("y", 340)
      .attr("dx", "-15px")
      .attr("dy", "-5px")
      // .attr("text-anchor", "end")
      .style("font-size", "12px")
      .style("fill", "#000")
      .text("Priorities");



      svg.append("text")
      .attr("class", "sections")
      .attr("x", 0)
      .attr("y", 340)
      .attr("dx", "-15px")
      .attr("dy", "-5px")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90,-20, 350)")
      .style("font-size", "10px")
      .style("fill", "#666")
      .text("% voters supporting a priority");

      svg.append("g").append("line")
        .attr("class", "ruler")
        .attr("x1", x(0))
        .attr("x2", x(0))
        .attr("y1", 0)
        .attr("y2", height)
        .style("stroke", "#000")
        .style("stroke-width", 4)
        .style("opacity", 0)


  var tTotal = svg.selectAll(".tTotal")
      .data(totalv)
    .enter().append("g")
      .attr("class", "tTotal")

      tTotal.append("path")
      .attr("d", function(d) { return area(d.values); })
      .style("fill", "#ccc") 
      .style("stroke", "#none")
      .style("opacity", .5)
      // .style("stroke-weigth", "3px")

  tTotal.selectAll(".tTotalcircle")
    .data(function(d) { return d.values})
    .enter().append("circle")
    .attr("class", "tTotalcircle")
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y3(d.y); })
    .attr("r", 3)
    .style("fill", "#000")
    .style("opacity", .2)
    // .style("stroke", "#ccc")
          .call(d3.helper.tooltip(function(d, i){
            var tcolor = "#333";
            return "<div style='text-align:center;color:#fff;background:"+tcolor+"'><span class='b'>Total Ballots: </span>"+d.value+"</div>";
          }));

    var ttlabel = tTotal.selectAll(".tTotallabel")
     .data(function(d) { return d.values})
    .enter().append("text")
    .attr("class", "tTotallabel")
    // .attr("class", function(d) { console.log(d); })
    .attr("x", function(d) { return x(d.date); })
    .attr("y", function(d) { return y3(d.y); })
    .attr("dx", 5)
    .attr("dy", 4)
    .style("text-anchor", "start")
    .style("font-size", "9px")
    .style("fill", "#000")
    .style("opacity", .4)
    .text(function(d) { return d.value})


var tAreas, rawF, dLayers;
var tlabels;

function redraw() {

  // console.log(dLayers)

  // d3.transition(svg).select(".y2.axis")
  //     .call(yAxis2);

   tAreas = svg.selectAll(".tAreas")
      .data(dLayers)


    var tAreasEnter = tAreas.enter().insert("g")
    // .filter(function(d) { return d.key != "N/A" })
      .attr("class", "tAreas")

      tAreasEnter.append("path")
      .attr("d", function(d) { return area2(d.values); })
      .style("fill", function(d, i) { return color(i); })
      .style("stroke", "#fff")
      .style("opacity", .5)
      .call(d3.helper.tooltip(function(d, i){
            var tcolor = color(i);
            return "<div style='text-align:center;color:#fff;background:"+tcolor+"'><span class='b'>" + d.key + " </span></div>";
          }));


      tAreasEnter.append("rect")
      .append("rect")
      .attr("class", "tAreaslabel")
      .attr("x", x(0))

      // .attr("x", function(d,i) { return x(1) })
      // .attr("y", function(d,i) { return y2(1)})
      // .attr("x", -10000)
      // .attr("y", -10000)
      // .attr("width", 0)
      // .attr("height", 0)
      // .style("fill", function(d,i) { return color(i)})
      .style("opacity", 0)

      tAreasEnter.append("text")
      .attr("class", "tAreaslabeltext")
      .attr("x", function(d,i) { return width - (i * 110) - 20 })
      .attr("y", function(d,i) { return y2(1) - 7 })
      .attr("dx", "-3px")
      .attr("text-anchor", "end")
      .style("font-size", "10px")
      .style("fill", "#000")
      .text(function(d) { return d.key });

        var tAreasUp = d3.transition(tAreas);

        tAreasUp.select("path")
      .attr("d", function(d) { return area2(d.values); })


      tAreasUp.select("rect")
      .attr("x", function(d,i) { return width - (i * 110) - 20 })
      .attr("y", function(d,i) { return y2(1) - 15 })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function(d,i) { return color(i)})
      .style("opacity", .5)

      tAreasUp.select("text")
       .attr("x", function(d,i) { return width - (i * 110) - 20 })
      .attr("y", function(d,i) { return y2(1) - 7 })
      .text(function(d) { return d.key });






      var tAreasExit = d3.transition(tAreas.exit()).remove();

      tAreasExit.select("text")
      .style("opacity", 0)

      tAreasExit.select("rect")
      .attr("x", 0)
      .attr("width", 0)
      .attr("height", 0)

          tAreasExit.select("path")
          .style("opacity", 0)

      tlabels = tAreas.selectAll(".tAreaslabels")
      .data(function(d){return d.values})    



}




  var tLines = svg.selectAll(".tLines")
      .data(rLines)
    .enter().append("g")
      .attr("class", "tLines")



  tLines.append("path")
      .attr("class", "tLinespath")
      .attr("d", function(d) { return line(d.values); })
      .style("fill", "none")
      .style("fill-opacity", 0)
      .style("stroke", function(d) { return priorities[d.key.substring(4)]['item-color']; })
      .on("mouseover", lineselect(function(d){return d}))
      .on("mouseout", lineselectOff(function(d){return d}));


  tLines.selectAll(".tLinesCircle")
    .data(function(d) { return d.values})
    .enter().append("circle")
    .attr("class", "tLinesCircle")
    .attr("cx", function(d) { return x(d.date); })
    .attr("cy", function(d) { return y(d.y); })
    .attr("r", 4.2)
    // .style("opacity", .5)
    .style("fill", function(d) { return priorities[d.key.substring(4)]['item-color']; })
    // .style("stroke", "#ccc")
          .call(d3.helper.tooltip(function(d, i){
            var tcolor = priorities[d.key.substring(4)]['item-color'];
            return "<div style='text-align:center;color:#fff;background:"+tcolor+"'><span class='b'>" + priorities[d.key.substring(4)]['item-title'] + " </span><br /> ("+d.valueabs+" - "+percent(d.value)+")</div>";
          }));

    var tllabel = tLines.selectAll(".tLineslabel")
     .data(function(d) { return d.values})
    .enter().append("text")
    .attr("class", "tLineslabel")
    // .attr("class", function(d) { console.log(d); })
    .attr("x", function(d) { return x(d.date); })
    .attr("y", function(d) { return y(d.y); })
    .attr("dx", 8)
    .attr("dy", 4)
    .style("text-anchor", "start")
    .style("font-size", "9px")
    .style("fill", "#000")
    .style("opacity", 0)
    .text(function(d) { return d.valueabs})
  


  svg.append("g")
      .attr("class", "x axis time large")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis on")
      .call(yAxis);

y2.domain([0, 1])


      svg.append("g")
      .attr("class", "y2 axis on")
      .call(yAxis2);


  svg.append("g")
      .attr("class", "y3 axis on")
      .call(yAxis3);

     svg.on("mousemove", function(d) { return highlight(d)})
     svg.on("mouseout", function(d) { return highlightOff(d)})


var datearray = [];

var tooltip2 = d3.select("#tseries")
    .append("div")
    .attr("class", "remove")
    .style("position", "relative")
    .style("z-index", "20")
    .style("visibility", "hidden")
    .style("top", "30px")
    .style("left", "55px");


function change () {
    
    var s = $('select#t-segments').val();

    rawF = raw.filter(function(d) { return d.cat == s})
  dLayers = stack2(nest.entries(rawF));
    


      d3.transition().duration(750).each(redraw);
    
}

$('#t-segments').change(change);

change();


  $("#loadingt").hide();


function lineselect(selected){
  // console.log(selected)
          tLines.selectAll(".tLinespath").style("opacity", .3)

          tLines.selectAll(".tLinespath")
          .filter(function(d){return d == selected})
          .style("opacity", 1)


}

function lineselectOff(selected){

   tLines.selectAll(".tLinespath")
          // .filter(function(d){return d == selected})
          .style("opacity", 1)

}


 function highlight(selected){

    var bodyNode = d3.select('#tseries').node();
    var absoluteMousePos = d3.mouse(bodyNode);
    mousex = absoluteMousePos[0];

    // mousex = d3.mouse(tTotal);
    // mousex = mousex[0];

    var invertedx = x.invert(mousex);
    invertedx = invertedx.getMonth() + invertedx.getDate();
    var selected = (dLayers[0].values);
    for (var k = 0; k < selected.length; k++) {
      datearray[k] = selected[k].date
      datearray[k] = datearray[k].getMonth() + datearray[k].getDate();
    }

    mousedate = datearray.indexOf(invertedx);
    var sdate = selected[mousedate].date

    var top1 = totalv[0].values[mousedate].value;
    var top2 = dLayers[0].values[mousedate].value;
    var top3 = rLines[0].values[mousedate].value;

    // console.log(totalv.filter(function(d, i) { return d[i]values.date = x(sdate) }));
    tTotal.selectAll(".tTotalcircle").style("opacity", .2)
    tTotal.selectAll(".tTotallabel").style("opacity", .4)

    tTotal.selectAll(".tTotalcircle")
      .filter(function(d){;return d.date == sdate})
      .style("opacity", 1)

       tTotal.selectAll(".tTotallabel")
      .filter(function(d){return d.date == sdate})
      .style("opacity", 1)

      tLines.selectAll(".tLineslabel").style("opacity", 0)
      tLines.selectAll(".tLineslabel")
      .filter(function(d){return d.date == sdate})
      .filter(function(d){return d.value > .59 })
      .style("opacity", 1)


    svg.selectAll(".ruler")
        .attr("x1", x(sdate))
        .attr("x2", x(sdate))
        .style("opacity", .3)

   }

    function highlightOff(selected){
        svg.selectAll(".ruler").style("opacity", 0)
        svg.selectAll(".totaltip").remove()

        tTotal.selectAll(".tTotalcircle").style("opacity", .2)
        tTotal.selectAll(".tTotallabel").style("opacity", .4)
        tLines.selectAll(".tLineslabel").style("opacity", 0)
   }



   d3.helper.ttip = function(accessor){
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


}




var segmentBar = function (api, data) {
	var ldata = data.rankings
	var barsdata = [];
	data.rankings.forEach(function(d,i){
		barsdata.push(d.count)
	})

	var bp = 5;
	var bh = 16;
	var bl = 260;

	var margin = {top: 12, right: 40, bottom: 0, left: 250},
    width = 400,
    height = 355 - margin.top - margin.bottom;


	var x = d3.scale.linear()
	    .domain([0, d3.max(barsdata)])
	    .range([0, 400]);

	var xAxis = d3.svg.axis().scale(x).orient("top").tickSize(-height).ticks(5);
	
	var y = d3.scale.ordinal()
    	.rangeRoundBands([0, height], .1);


	var svg = d3.select("#segment-bar").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		// .style("margin-left", -margin.left + "px")
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
	    .attr("class", "x axis");

	svg.append("g")
	    .attr("class", "y axis")
	  .append("line")
	    .attr("class", "domain")
	    .attr("y2", height);


function redraw() {

	

	barsdata = [];
	ldata.forEach(function(item){
		barsdata.push(item.count)
		item.priid = item.id;
	})

	y.domain(ldata.map(function(d) { return d.id; }));

		x.domain([0, d3.max(barsdata)]);

	  d3.transition(svg).select(".x.axis")
      .call(xAxis);

	var bar = svg.selectAll(".bar")
      .data(ldata, function(d) { return d.priid; });

     var barEnter = bar.enter().insert("g", ".axis")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(0," + (y(d.id) + height) + ")"; })
      .style("fill-opacity", 0);

      barEnter.append("rect")
      .attr("width", function(d) { return x(d.count); })
      .attr("height", y.rangeBand())
      .style("fill", "#eee") 

      barEnter.append("rect")
      .attr("width", "20px" )
      .attr("height", y.rangeBand())
      .style("fill", function(d) { return priorities[d.id]['item-color']; }) 

      barEnter.append("text")
      .attr("class", "barlabel")
      .attr("x", -3)
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "end")
      .text(function(d) { return priorities[d.id]['item-title']; })

       barEnter.append("text")
      .attr("class", "value")
      .attr("x", function(d) { return x(d.count) + 3; })
      .attr("y", y.rangeBand() / 2)
      .attr("dy", ".35em")
      .attr("text-anchor", "start");


	var barUpdate = d3.transition(bar)
      .attr("transform", function(d) { return "translate(0," + (d.y0 = y(d.id)) + ")"; })
      .style("fill-opacity", 1);


  barUpdate.select(".value")
      .attr("x", function(d) { return x(d.count) + 3; })
      .text(function(d) { return d.count; });


  barUpdate.select("rect")
      .attr("width", function(d) { return x(d.count); });    

  var barExit = d3.transition(bar.exit())
      .attr("transform", function(d) { return "translate(0," + (d.y0 + height) + ")"; })
      .style("fill-opacity", 0)
      .remove();

  barExit.select(".value")
      .attr("x", function(d) { return x(d.count) + 3; })
      .text(function(d) { return d.count; });

    barExit.select("rect")
      .attr("width", function(d) { return x(d.count); });

    $("#loadings").hide();


}


function change () {
		
		var s_country = $('select#s-country').val();
		var s_gender = $('select#s-gender').val(); 
		var s_age1 = "&age_lb=" + ageVal[0]; 
		var s_age2 = "&age_ub=" + ageVal[1]; 
		var s_edu = $('select#s-edu').val(); 

		if (ageVal[0]==1 && ageVal[1] == 140){
			var sapi = api+s_country+s_gender+s_edu;
      var csv = "http://54.227.246.164/stats/csv/segment?" +s_country+s_gender+s_edu
		}

		else { 
      var sapi = api+s_country+s_gender+s_edu+s_age1+s_age2; 
      var csv = "http://54.227.246.164/stats/csv/segment?"+s_country+s_gender+s_edu+s_age1+s_age2
    }

    


    // console.log(csv)

    $("#csv-button").attr('href', csv);
		

		$.getJSON(sapi, function(ndata) {
		// console.log(ndata)

		var title = $('select#s-country option:selected').text() + " / " + $('select#s-gender option:selected').text() + " / " + $('select#s-edu option:selected').text() + " / " + "Age Group ("+ ageVal[0] + " - " + ageVal[1] + ")"

		$("#segmentv1").text(ndata.tVotes)
		$("#segmentv2").text(title)	
		
		ldata = ndata.rankings;
			d3.transition().duration(750).each(redraw);
		});

}

$('.target').change(change);

	$( "#age-slider" ).slider({
		range: true,
		min: 1,
        max: 140,
		values: [ 1, 140 ],
		slide: function(event, ui) {
            $("#age-value").text(ui.values[0]+" - "+ui.values[1]);
            ageVal = $("#age-slider").slider("option", "values");
            // change();
	    },
	    change: change
	});
	
	ageVal = $("#age-slider").slider("option", "values");

	$("#age-value").text(ageVal[0] + " - " + ageVal[1]);

change();

}

var segmentSummary = function (data) {
	var coma = d3.format(",");
	// console.log(data)

	data.sort(function(obj1, obj2) {
		return obj1.order - obj2.order;
	});


	var margin = {top: 80, right: 0, bottom: 60, left: 280},
		width = 940 - margin.left - margin.right,
		height = 650 - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.2);

	var y = d3.scale.linear()
		.range([0, height]);

	data.forEach(function(d) {
	    var y0 = 0;
	    var t = 0;
	    d.rankings.forEach(function(f) {
	    	t += f["count"]
	    });

	    d.totalvotes = t;
	    // console.log(t);
	    var m = 0;
	    var p = 0;
	    d.rankings.forEach(function(f, i) {
	    	m += p;
	    	p = parseFloat(f["count"]/t);
	    	f["y1"] = p;
	    	f["y0"] = m;
	    	f["priid"] = f["id"]
	    	// console.log(i, f)
	    	// console.log(i)
	    });
	    // d.rankings["y0"] = 0;
	    // d.rankings["y1"] = d.rankings["count"];
		// console.log(d.rankings)
    	// d.rankings = color2.domain().map(function(name) { console.log(name); return {name: name, y0: y0, y1: y0 += +d[name]}; });
    	// d.total = d.rankings[d.rankings.length - 1].y1;

  	});	


  	x.domain(data.map(function(d) { return d.title; }));
	y.domain([0, 1]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("top");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(d3.format(".2s"));

	var svg = d3.select("#segment-summary").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
  svg.append("g")
      .attr("class", "x axis large")
      .attr("text-anchor", "start")
      .call(xAxis);

	svg.select(".x.axis")
		.call(xAxis)
		.selectAll("text")
		.attr("transform", "rotate(-50)")
		.style("text-anchor", "start");

	svg.append("text")
		.attr("transform", "translate(0," + (height+margin.bottom)  + ")")
		.attr("dx", "18px")
		.attr("dy", "-23px")
		.attr("text-anchor", "end")
		.style("font-size", "11px")  
		.style("fill", "#666")  
		.text("Ballots:");	

  // svg.selectAll(".legendvoters")
	 //  .data(data.rankings)
  //     .attr("class", "legendvoters")
  //     .attr("transform", "translate(0," + (height+margin.bottom)  + ")")
  //     .enter().append("text")
  //     .attr("x", x.rangeBand())
	 //  .attr("y", function(d) { return y(d.y0); })
	 //  .attr("dx", "-18px")
	 //  .attr("dy", "15px")
	 //  .attr("text-anchor", "middle")
	 //  .text(function(d,i) { return d.totalvotes});



  // svg.append("g")
  //     .attr("class", "y axis")
  //     .call(yAxis)
	 //    .append("text")
  //     .attr("transform", "rotate(-90)")
  //     .attr("y", 6)
  //     .attr("dy", ".71em")
  //     .style("text-anchor", "end")
  //     .text("Votes");


  var ls = 15;
  var lp = 3;

    var legend = svg.selectAll(".legend")
      .data(data[0].rankings)
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d) { return "translate(" + -margin.left +  ",0)"; })
      .on("mouseover", function(d) { return highlight(d)})
      .on("mouseout", function(d) { return highlightOff(d)})

      legend
	    .append("rect")
	    .attr("class", "legendboxback")
	    .attr("x", 0)
	    .attr("y", function(d,i) {return i*(lp+ls)})
	    .attr("width", 250)
	    .attr("height", ls+lp)
	    .style("fill", "#fff")

    legend
	    .append("rect")
	    .attr("class", "legendbox")
	    .attr("x", 0)
	    .attr("y", function(d,i) {return i*(lp+ls)})
	    .attr("width", ls)
	    .attr("height", ls)
	    .style("fill", function(d) { return priorities[d.priid]['item-color'];})

	legend
		.append("text")
	    .attr("y", function(d,i) {return i*(lp+ls)})
	    .attr("dy", "1em")
	    .attr("x", lp+ls)
	    .style("font-size", "12px")
	    .text(function(d,i) {return priorities[d.id]['item-title']});

  var seg = svg.selectAll(".state")
      .data(data)
    .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.title) + ",0)"; });

	seg.append("g")
		.attr("transform", "translate(0," + (height+margin.bottom)  + ")")
        .append("text")
		.attr("dx", x.rangeBand()/2)
		.attr("dy", "-23px")
		.attr("text-anchor", "middle")
		.style("font-size", "11px")  
		.text(function(d,i) { return coma(d.tVotes)});


  seg.selectAll(".pri")
      .data(function(d) { return d.rankings; })
    .enter().append("rect")
      .attr("class", "pri")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if(y(d.y0)) {return y(d.y0)} else {return 0}; })
      .attr("height", function(d) { if(y(d.y1)) {return y(d.y1)} else { return 0 }; })
      // .style("stroke", "#fff")
      .style("fill", function(d) { return priorities[d.id]['item-color'];})
      .call(d3.helper.tooltip(function(d, i){
      			// var tcolor = d3.rgb(priorities[d.id]['item-color']).brighter(2)
      			var tcolor = "#fff"
      			if (d.priid == 15 || d.priid == 16 || d.priid == 6){
		    		tcolor = "#111"
		    	}
          		return "<div style='text-align:center;color:"+tcolor+";background:"+priorities[d.id]['item-color']+"'><span class='b'>" + priorities[d.id]['item-title'] + " </span><br /> (" + d.count +  ")</div>";
      		}))

      seg.selectAll(".pritext")
        .data(function(d) { return d.rankings; })
        .enter().append("text")
        .attr("class", "pritext")
	    .attr("x", x.rangeBand()/2)
		.attr("y", function(d) {return y(d.y0); })
		// .attr("dx", "-18px")
	    .attr("dy", "15px")
	    .style("text-anchor", "middle")
	    .style("font-size", "11px")
	    .style("display", "none")
	    .style("fill", function(d) { 
	    	if (d.priid == 15 || d.priid == 16){
	    		return "#000"
	    	}
	    	else {
	    		return "#fff"
	    	}
	    	})
	    .text(function(d,i) { return "#"+(i+1)});
 
    	

   function highlight(selected){
   		// console.log(selected.priid)

   		d3.selectAll(".pri")
   			.filter(function(d) { return d.priid == selected.priid; })
   			// .style("stroke", function(d){
   			// 	var c = priorities[d.priid]['item-color']
   			// 	return d3.rgb(c).darker()
   			// })
   			// .call(d3.helper.tooltip(function(selected){
      //     		return "<div style='background:"+priorities[selected.id]['item-color']+"'><span class='b'>" + priorities[selected.id]['item-title'] + " </span> (" + selected.count +  ")</div>";
      // 		}))


		d3.selectAll(".pritext")
   			.filter(function(d) { return d.priid == selected.priid; })
   			.style("display", "block");

   		d3.selectAll(".pri")
   			.filter(function(d) { return d.priid != selected.priid; })
   			// .transition()
   			.style("opacity", .1)

   		d3.selectAll(".legend")
   			.filter(function(d) { return d.priid != selected.priid; })
   			// .transition()
   			.style("opacity", .1)

   }

   function highlightOff(selected){
   		// console.log(selected.priid)
   		d3.selectAll(".pri")
   			// .delay(200)
   			.style("opacity", 1)

   		d3.selectAll(".legend")
	   		// .delay(200)
   			.style("opacity", 1)

   		d3.selectAll(".pritext")
	   		// .delay(200)
   		    .style("display", "none")

   }

   $("#loadings2").hide();

}


var donuts = function(data) {
	$('#charts').html('')
	// console.log(data)

	var tEdu0 = data.tVotes - (data.tEdu1+data.tEdu2+data.tEdu3+data.tEdu4);


	var ddata = [
		{title: 'Gender', values: [
			{id: 0, name: 'Male', value: data.tGender1},
			{id: 1, name: 'Female', value: data.tGender2}
		]},
		{title: 'Age', values: [
			{id: 0, name: '≤34', value: data.tAge1},
			{id: 1, name: '35 - 54', value: data.tAge2},
			{id: 2, name: '≥55', value: data.tAge3}
		]},
		{title: 'Education', values: [
			{id: 0, name: 'Unknown', value: tEdu0},
			{id: 1, name: 'Some primary', value: data.tEdu1},
			{id: 2, name: 'Finished primary', value: data.tEdu2},
			{id: 3, name: 'Finished secondary', value: data.tEdu3},
			{id: 4, name: 'Beyond secondary', value: data.tEdu4}
		]}	
	]

	if (data.tHdi1) {
		ddata.push(
			{title: 'HDI', values: [
			{id: 0, name: 'Low', value: data.tHdi1},
			{id: 1, name: 'Medium', value: data.tHdi2},
			{id: 2, name: 'High', value: data.tHdi3},
			{id: 3, name: 'Very High', value: data.tHdi4}
		]}
			)
	}

	// console.log(ddata);

	var radius = 74,
	    padding = 10;

	var dColors = ["#FF8000", "#f30", "#DF3A01", "#FE9A2E", "#B43104"]



	var arc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius - 30);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { return d.value; });

	// console.log(ddata)

	var svg = d3.select("#charts").selectAll(".pie")
	      .data(ddata)
	    .enter().append("svg")
	      .attr("class", "pie")
	      .attr("width", radius * 2)
	      .attr("height", 260)
	    .append("g")
	      .attr("transform", "translate(" + radius + "," + radius + ")");

	  svg.selectAll(".arc")
	      .data(function(d) { return pie(d.values); })
	    .enter().append("path")
	      .attr("class", "arc")
	      .attr("d", arc)
	      .style("fill", function(d) { return color(d.data.name);})
	      .call(d3.helper.tooltip(function(d, i){
          		return "<div style='background:"+color(d.data.name)+"'><span class='b'>" + d.data.name + " </span> (" + Math.round(d.value/data.tVotes*100) +  " %)</div>";
      		}));

	  svg.append("text")
	      .attr("dy", ".35em")
	      .style("text-anchor", "middle")
	      .text(function(d) { return d.title; });

	  svg.selectAll(".rect")
	  	   .data(function(d) { return d.values})
	   	   .enter().append("rect")
	   	   .attr("class", "legend")
	  	   .attr("x", -radius+15)
		   .attr("y", function(d){return (20 * d.id) + radius + padding})
		   .attr("width", 8)
		   .attr("height", 18)
   	       .style("fill", function(d) { 
   	       		return color(d.name);})

   	  	  svg.selectAll(".legendtitle")
			.data(function(d) { return d.values})
			.enter().append("text")
			.attr("class", "legendtitle")
			.attr("x", -radius+28)
			.attr("dy", ".35em")
			.attr("y", function(d){return (20 * d.id) + radius + padding + 10})
			.text(function(d) { return d.name + " (" + d.value + ")"; });     

}

var cTable = function (data) {

	$("#cTable").show();


	var hdi_title = ["Low","Medium","High","Very High"]
	var table_obj = $('#countrylist');
    $.each(data.countries, function(index, item){
    	//console.log(item);
    	if(item.country<194) {
    	var edut =  item.demo.education[1] + item.demo.education[2] + item.demo.education[3] + item.demo.education[4];

    	var c = '<td style="text-align:left;">'+countries[item.country].name+'</td>'
    	var hdi = '<td>'+hdi_title[item.hdi_index-1]+'</td>'
    	var t = '<td>'+item.tVotes+'</td>'
    	var tp = '<td>'+(item.tVotes/data.tVotes*100).toFixed(1)+'%</td>'
    	var m = '<td>'+Math.round(item.demo.gender[1]/item.tVotes*100)+'%</td>'
    	var f = '<td>'+Math.round(item.demo.gender[2]/item.tVotes*100)+'%</td>'
    	var a1 = '<td>'+Math.round(item.demo.ageGroup.group1/item.tVotes*100)+'%</td>'
    	var a2 = '<td>'+Math.round(item.demo.ageGroup.group2/item.tVotes*100)+'%</td>'
    	var a3 = '<td>'+Math.round(item.demo.ageGroup.group3/item.tVotes*100)+'%</td>'
    	var e1 = '<td>'+Math.round(item.demo.education[1]/edut*100)+'%</td>'
    	var e2 = '<td>'+Math.round(item.demo.education[2]/edut*100)+'%</td>'
    	var e3 = '<td>'+Math.round(item.demo.education[3]/edut*100)+'%</td>'
    	var e4 = '<td>'+Math.round(item.demo.education[4]/edut*100)+'%</td>'

		table_obj.append($('<tr id="'+countries[item.country].name+'">'+c+hdi+t+tp+m+f+a1+a2+a3+e1+e2+e3+e4+'</tr>'));
		$("#table-country").tablesorter();
		}
    })
}

var pTable = function (data) {

	$("#pTable").show();


	// var hdi_title = ["Low","Medium","High","Very High"]
	var table_obj = $('#t-partnerlist');
    $.each(data, function(index, item){

    	if (item.tVoters>0){
    		// console.log(item.tVoters);

    		var p1 = '<td style="text-align:left;">'+item.organization+'</td>';
    		var p2 = '<td>'+item.volunteer_id+'</td>';
    		// var p3 = '<td>'+item.first_name+' '+item.last_name+'</td>';
    		var p4 = '<td>'+item.tVoters+'</td>';

    		// console.log(p1,p2,p3,p4)

			table_obj.append($('<tr id="'+item.volunteer_id+'">'+p1+p2+p4+'</tr>'));
			// $("#table-partner").tablesorter();
		}
    })
}

	

$.getJSON(list, function(data) {
		countries = data.fields_values.countries;
		priorities = data.accordion_items;
		
		$.each(data.fields_values.countries, function(index, item){
			if (index>0) {
				$("ul#drop-country").append($('<li><a tabindex="-1" href="?country='+item.name+'">'+item.name+"</a></li>"));
				$("select#s-country").append($('<option value="&country='+item.id+'">'+item.name+"</option>"));
			}
		});

	$.getJSON(partnerlist, function(data) {
		partners = data.partner_rankings;

		pTable(partners);

		var divide = false;

		$.each(partners, function(index, item){
			if (item.tVoters>0){
				$("ul#drop-partner").append($('<li><a tabindex="-1" href="?partner='+item.volunteer_id+'">'+item.organization+" ("+item.tVoters+")</a></li>"));
			}
			else if (item.tVoters==0) {
				if (!divide) { 
					$("ul#drop-partner").append($('<li class="divider"></li>'));
					divide = true;
				}
				$("ul#drop-partner").append($('<li><a class="disabled-link" tabindex="-1" href="?partner='+item.volunteer_id+'">'+item.organization+"</a></li>"));
			}

			
		});
		var params = $.deparam.querystring();
		getId(params);

	});
	


	
	// if (params={}) {
	// 	$(window).bind( 'hashchange', function(e) {
	// 		params = $.param.fragment();
	// 		getId(params);

	// 		$("#current").text(params)
	// 	})
	// 	$(window).trigger( 'hashchange' );
	// }

	// else {
	// 	getId(params.country);
	// }

});


});


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



// BOOTSTRAP UI MOD


$(function(){


	$('.dropdown-toggle').dropdown();

	$(".disabled-link").click(function(event) {
	  event.preventDefault();
	});

    $(".dropdown-toggle li a").click(function(){

      $(".btn:first-child").text($(this).text());
      $(".btn:first-child").val($(this).text());

   });

});
