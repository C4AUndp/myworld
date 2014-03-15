
var color = d3.scale.ordinal().range(["#FF8000", "#f30", "#DF3A01", "#a05d56", "#B43104"]);

$(function(){

var list = "assets/data/default.json"

var api1 = "http://54.227.246.164/stats/"
var api2 = "http://54.227.246.164/stats2/"

var overview = api2 + "demographics";
var partnerlist = "http://54.227.246.164/stats2/value_list?dim=partner"

var countries, priorities, partners;
var sources = [{name:"Website",id:"website"},{name:"Ballot",id:"offline"},{name:"SMS",id:"sms"}]
var hdi = ["low","medium", "high", "veryhigh"]
var sCountry;
var donutData;
var ageVal;

// TIME VARS
var coma = d3.format(",");


// Analyze the ID for calling the API
var renderCountry = function (cid) {
    var xapi = overview + cid;
    var sapi = api2 + "segment" + cid;

    callAPI(xapi)
		callSegment(sapi);
}

var callAPI = function (api) {
	$.getJSON(api, function(jdata) {
		$("#loadingd").show();
		donuts(jdata);
		totals(jdata._total);
		$('#update').html('Data Last Updated<br>'+new Date());
  })
}


var callSegment = function (api) {
	$.getJSON(api, function(jdata) {
		$("#loadings").show();
		callAllsegments(api);
	});
}

var callAllsegments = function (api) {
	var segments = []; 
	var s = api;
	var url = [
		{name:"Male",order:1,url:s+"&gender=1"},
		{name:"Female",order:2,url:s+"&gender=2"},
		{name:"Some Prim.",order:8,url:s+"&education=1"},
		{name:"Finished Prim.",order:9,url:s+"&education=2"},
		{name:"Finished Secondary",order:10,url:s+"&education=3"},
		{name:"Beyond Secondary",order:11,url:s+"&education=4"},
		{name:"≤15",order:3,url:s+"&age=15"},
    {name:"16-30",order:4,url:s+"&age=30"},
		{name:"31-45",order:5,url:s+"&age=45"},
    {name:"46-60",order:6,url:s+"&age=60"},
		{name:"≥61",order:7,url:s+"&age=61"}
	];


	if (s.substring(62,69) != "country"){
		url.push(
			{name:"Low HDI",order:12,url:s+"&hdi=1"},
			{name:"Medium HDI",order:13,url:s+"&hdi=2"},
			{name:"High HDI",order:14,url:s+"&hdi=3"},
			{name:"Very High HDI",order:15,url:s+"&hdi=4"}
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


var segmentSummary = function (data) {

  $("#segment-summary").html('');

  var elem = { w: $("#myw-country").innerWidth()-30, h: 400 }
	data.sort(function(obj1, obj2) {
		return obj1.order - obj2.order;
	});


	var margin = {top: 90, right: 10, bottom: 60, left: 290},
		width = elem.w - margin.left - margin.right,
		height = elem.h - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.1);

	var y = d3.scale.linear()
		.range([0, height]);

	data.forEach(function(d) {

      d.rankings.sort(function(obj1, obj2) {
        return obj2.count - obj1.count;
      });

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
		.attr("transform", "rotate(-60)")
    .style("text-anchor", "start");

	svg.append("text")
		.attr("transform", "translate(0," + (height+margin.bottom)  + ")")
		.attr("dx", "0px")
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
	    .style("fill", function(d) { return priorities[d.pri_id]['item-color'];})

	legend
		.append("text")
	    .attr("y", function(d,i) {return i*(lp+ls)})
	    .attr("dy", "1em")
	    .attr("x", lp+ls)
	    .style("font-size", "12px")
	    .text(function(d,i) {return priorities[d.pri_id]['item-title']});

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
		.style("font-size", "9px")  
		.text(function(d,i) { return coma(d._total)});


  seg.selectAll(".pri")
      .data(function(d) { return d.rankings; })
    .enter().append("rect")
      .attr("class", "pri")
      .attr("width", x.rangeBand())
      .attr("y", function(d) { if(y(d.y0)) {return y(d.y0)} else {return 0}; })
      .attr("height", function(d) { if(y(d.y1)) {return y(d.y1)} else { return 0 }; })
      // .style("stroke", "#fff")
      .style("fill", function(d) { return priorities[d.pri_id]['item-color'];})
      .call(d3.helper.tooltip(function(d, i){
      			// var tcolor = d3.rgb(priorities[d.id]['item-color']).brighter(2)
      			var tcolor = "#fff"
      			if (d.pri_id == 15 || d.pri_id == 16 || d.pri_id == 6){
		    		tcolor = "#111"
		    	}
          		return "<div style='text-align:center;color:"+tcolor+";background:"+priorities[d.pri_id]['item-color']+"'><span class='b'>" + priorities[d.pri_id]['item-title'] + " </span><br /> (" + coma(d.count) +  ")</div>";
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
	    	if (d.pri_id == 15 || d.pri_id == 16){
	    		return "#000"
	    	}
	    	else {
	    		return "#fff"
	    	}
	    	})
	    .text(function(d,i) { return "#"+(i+1)});
 
    	

   function highlight(selected){
   		// console.log(selected.pri_id)

   		d3.selectAll(".pri")
   			.filter(function(d) { return d.pri_id == selected.pri_id; })
   			// .style("stroke", function(d){
   			// 	var c = priorities[d.pri_id]['item-color']
   			// 	return d3.rgb(c).darker()
   			// })
   			// .call(d3.helper.tooltip(function(selected){
      //     		return "<div style='background:"+priorities[selected.id]['item-color']+"'><span class='b'>" + priorities[selected.id]['item-title'] + " </span> (" + selected.count +  ")</div>";
      // 		}))


		d3.selectAll(".pritext")
   			.filter(function(d) { return d.pri_id == selected.pri_id; })
   			.style("display", "block");

   		d3.selectAll(".pri")
   			.filter(function(d) { return d.pri_id != selected.pri_id; })
   			// .transition()
   			.style("opacity", .1)

   		d3.selectAll(".legend")
   			.filter(function(d) { return d.pri_id != selected.pri_id; })
   			// .transition()
   			.style("opacity", .1)

   }

   function highlightOff(selected){
   		// console.log(selected.pri_id)
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

  var ddata = data.dimensions;

	$('#charts').html('')




	var do_data = [
		{title: 'Gender', values: [
			{id: 0, name: 'Male', value: ddata.gender['1']},
			{id: 1, name: 'Female', value: ddata.gender['2']}
		]},
		{title: 'Age', values: [
			{id: 0, name: '≤15', value: ddata.age['15']},
			{id: 1, name: '16 - 30', value: ddata.age['30']},
			{id: 2, name: '31 - 45', value: ddata.age['45']},
      {id: 3, name: '46 - 60', value: ddata.age['60']},
      {id: 4, name: '≥61', value: ddata.age['140']},
		]},
		{title: 'Education', values: [
			{id: 0, name: 'Unknown', value: ddata.education['_other']},
			{id: 1, name: 'Some Prim.', value: ddata.education['1']},
			{id: 2, name: 'Finished Prim.', value: ddata.education['2']},
			{id: 3, name: 'Finished Sec.', value: ddata.education['3']},
			{id: 4, name: 'Beyond Sec.', value: ddata.education['4']}
		]}	
	]

	if (ddata.hdi) {
		do_data.push(
			{title: 'HDI', values: [
			{id: 0, name: 'Low', value: ddata.hdi['1']},
			{id: 1, name: 'Medium', value: ddata.hdi['2']},
			{id: 2, name: 'High', value: ddata.hdi['3']},
			{id: 3, name: 'Very High', value: ddata.hdi['4']},
      {id: 4, name: 'N/A', value: ddata.hdi['NA']}
		]}
		)
	}


	var radius = 65,
	    padding = 10;

	var dColors = ["#FF8000", "#f30", "#DF3A01", "#FE9A2E", "#B43104"]



	var arc = d3.svg.arc()
	    .outerRadius(radius)
	    .innerRadius(radius - 25);

	var pie = d3.layout.pie()
	    .sort(null)
	    .value(function(d) { 
        if(d.value) { return d.value }
          else { return 0}; 
      });

	// console.log(ddata)

	var svg = d3.select("#charts").selectAll(".pie")
	      .data(do_data)
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
          		return "<div style='background:"+color(d.data.name)+"'><span class='b'>" + d.data.name + " </span> (" + Math.round(d.data.value/data._total*100) +  " %)</div>";
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
			.text(function(d) { 
        if (d.value) { return d.name + " (" + coma(d.value) + ")"; }
        else { return d.name + " (0)"; }

      });     
      $("#loadingd").fadeOut();


}




$.getJSON(list, function(data) {
		countries = data.fields_values.countries;
		priorities = data.accordion_items;
		
		$.each(data.fields_values.countries, function(index, item){
			if (index>0) {
				// $("ul#drop-country").append($('<li><a tabindex="-1" href="?country='+item.name+'">'+item.name+"</a></li>"));
				$("select#s-country").append($('<option value="?country='+item.id+'">'+item.name+"</option>"));
        // console.log(item.id,item.name)
			}
		});
		// getId(params);
    // getId({"country":"Angola"})
    renderCountry($('#s-country').val());
	});

d3.select("#s-country").on("change", function() { 
  renderCountry($('#s-country').val());
})


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




