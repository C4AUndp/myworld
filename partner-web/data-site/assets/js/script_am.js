// var dColors = ["#02B3EE", "#54D0F9", "#01CEE1", "#95E0F9", "#0386E3"]
var dColors = ["#FF8000", "#f30", "#DF3A01", "#FE9A2E", "#B43104"]

var hdi_title = ["Low","Medium","High","Very High"]

var list = "assets/data/default.json"
var api = "http://50.57.78.160:3000/"

var countries;
var priorities;

$.getJSON(list, function(data) {
	countries = data.fields_values.countries;
	priorities = data.accordion_items;

	$.each(data.fields_values.countries, function(index, item){
		$("select#s-country").append($('<option value="'+item.id+'">'+item.name+"</option>"));
	});

	$.getJSON(api,processData);
});

var processData = function(data) {

	$("#total").html('');

	var counterholder = $("#total");
	var counter = data.tVotes.toString().split('');

	for (var i=0; i<3; i++){
		counterholder.append($('<span class="count">&nbsp;</span>'));
	}

	$.each(counter, function(index, item){
		counterholder.append($('<span class="count">'+item+'</span>'));
	});




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


	var tEdu0 = data.tVotes - (data.tEdu1+data.tEdu2+data.tEdu3+data.tEdu4);

	var dGender = [ 
		{label: "Male", data:data.tGender1, color: dColors[0]}, 
		{label: "Female", data:data.tGender2, color: dColors[1]}
	]
	

	var dAge = [ 
		{label: "&#8804;34", data:data.tAge1, color: dColors[0]}, 
		{label: "35-54", data:data.tAge2, color: dColors[1]}, 
		{label: "&#8805;55", data:data.tAge3, color: dColors[2]}, 
	]

	var dHdi = [ 
		{label: "Low", data:data.tHdi1, color: dColors[0]}, 
		{label: "Medium", data:data.tHdi2, color: dColors[1]}, 
		{label: "High", data:data.tHdi3, color: dColors[2]}, 
		{label: "Very High", data:data.tHdi4, color: dColors[3]}, 
	]


	var dEdu = [ 
		{label: "Unknown", data:tEdu0, color: dColors[0] }, 
		{label: "Some primary", data:data.tEdu1, color: dColors[1]}, 
		{label: "Finished primary", data:data.tEdu2, color: dColors[2]}, 
		{label: "Finished secondary", data:data.tEdu3, color: dColors[3]}, 
		{label: "Beyond secondary", data:data.tEdu4, color: dColors[4]} 
	]


	var pieopt = {series: {
				pie: { 
					radius: 1,
					show: true,
					// position: 'nw',
					innerRadius: 0.5,
					label: {
	                    show: false,
	                    radius: 1/2,
	                    formatter: function(label, series){
	                        return '<div class="d-label">'+label+' : '+Math.round(series.percent)+'%</div>';
	                    },
	                    threshold: 0.3
					},

				}
			},
			legend: { 
				show: true, 
				backgroundColor: 'none',
				position: 'se'
				// container: function(label, series, legend){ 
				// 		console.log(series,label,legend)
				// 	}
			},
			grid: { hoverable: true, clickable: true}
		}
			

	$.plot($("#d-gender"), dGender, pieopt);
	$.plot($("#d-age"), dAge, pieopt);
	$.plot($("#d-hdi"), dHdi, pieopt);
	$.plot($("#d-education"), dEdu, pieopt);

	$("#d-gender, #d-hdi, #d-age, #d-education").bind("plothover", pieHover);
	// $("#d-gender").bind("plotclick", pieClick);

	$("#d-gender, #d-hdi, #d-age, #d-education").append('<div class="hover">');
	$('.target').change();


	var d = new Date();
	$('#update').html('Data Last Updated<br>'+d); 

};
/*
$.getJSON(api, function(data) {
	
	// console.log(data)
	
	$("#total").html('');

	var counterholder = $("#total");
	var counter = data.tVotes.toString().split('');

	for (var i=0; i<3; i++){
		counterholder.append($('<span class="count">&nbsp;</span>'));
	}

	$.each(counter, function(index, item){
		counterholder.append($('<span class="count">'+item+'</span>'));
	});




	var table_obj = $('#countrylist');
    $.each(data.countries, function(index, item){

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

    })


	var tEdu0 = data.tVotes - (data.tEdu1+data.tEdu2+data.tEdu3+data.tEdu4);

	var dGender = [ 
		{label: "Male", data:data.tGender1, color: dColors[0]}, 
		{label: "Female", data:data.tGender2, color: dColors[1]}
	]
	

	var dAge = [ 
		{label: "&#8804;34", data:data.tAge1, color: dColors[0]}, 
		{label: "35-54", data:data.tAge2, color: dColors[1]}, 
		{label: "&#8805;55", data:data.tAge3, color: dColors[2]}, 
	]

	var dHdi = [ 
		{label: "Low", data:data.tHdi1, color: dColors[0]}, 
		{label: "Medium", data:data.tHdi2, color: dColors[1]}, 
		{label: "High", data:data.tHdi3, color: dColors[2]}, 
		{label: "Very High", data:data.tHdi4, color: dColors[3]}, 
	]


	var dEdu = [ 
		{label: "Unknown", data:tEdu0, color: dColors[0] }, 
		{label: "Some primary", data:data.tEdu1, color: dColors[1]}, 
		{label: "Finished primary", data:data.tEdu2, color: dColors[2]}, 
		{label: "Finished secondary", data:data.tEdu3, color: dColors[3]}, 
		{label: "Beyond secondary", data:data.tEdu4, color: dColors[4]} 
	]


	var pieopt = {series: {
				pie: { 
					radius: 1,
					show: true,
					// position: 'nw',
					innerRadius: 0.5,
					label: {
	                    show: false,
	                    radius: 1/2,
	                    formatter: function(label, series){
	                        return '<div class="d-label">'+label+' : '+Math.round(series.percent)+'%</div>';
	                    },
	                    threshold: 0.3
					},

				}
			},
			legend: { 
				show: true, 
				backgroundColor: 'none',
				position: 'se'
				// container: function(label, series, legend){ 
				// 		console.log(series,label,legend)
				// 	}
			},
			grid: { hoverable: true, clickable: true}
		}
			

	$.plot($("#d-gender"), dGender, pieopt);
	$.plot($("#d-age"), dAge, pieopt);
	$.plot($("#d-hdi"), dHdi, pieopt);
	$.plot($("#d-education"), dEdu, pieopt);

	$("#d-gender, #d-hdi, #d-age, #d-education").bind("plothover", pieHover);
	// $("#d-gender").bind("plotclick", pieClick);

	$("#d-gender, #d-hdi, #d-age, #d-education").append('<div class="hover">');
	$('.target').change();


	var d = new Date();
	$('#update').html('Data Last Updated<br>'+d); 

});
*/

$('.target').change(function() {

	var s_hdi = $('select#s-hdi').val(); 
	var s_country = $('select#s-country').val(); 
	var s_gender = $('select#s-gender').val(); 
	var s_age = $('select#s-age').val(); 
	var s_edu = $('select#s-edu').val(); 

	var segment = api+'segment?'+'hdi='+s_hdi+'&country='+s_country+'&gender='+s_gender+'&age_group='+s_age+'&education='+s_edu;


	$.getJSON(segment, function(data) {
			// console.log(data.tVotes)

			$("#segmentv1").text(data.tVotes)
			$("#segmentv2").text($('select#s-hdi option:selected').text())
			$("#segmentv6").text($('select#s-country option:selected').text())
			$("#segmentv3").text($('select#s-gender option:selected').text())
			$("#segmentv4").text($('select#s-age option:selected').text())
			$("#segmentv5").text($('select#s-edu option:selected').text())
			var table_obj = $('#rankings');
			var table_obj2 = $('#rankings2');
			table_obj.html('');
			table_obj2.html('');

			if (data.tVotes>0) {

		    $.each(data.rankings, function(index, item){	    	
		    	
		    	var color, title;
		    	

		    	if (item.id == 0) {
		    		console.log("optional")
		    		color= "#CCC";
		    		title= "Suggest a priority (optional)"

		    	}

		    	else {
		    		color = priorities[item.id]['item-color'];
		    		title = priorities[item.id]['item-title'];
		    	}


				var r1 = '<td class="span1">#'+(index+1)+'</td>'
		    	var r2 = '<td class="span1" style="background:'+color+'">&nbsp;</td>'
		    	var r3 = '<td class="span10" style="text-align:left">'+title+'</td>'
		    	if (index<9) {table_obj.append($('<tr id="'+index+'">'+r1+r2+r3+'</tr>'));}
				else {table_obj2.append($('<tr id="'+index+'">'+r1+r2+r3+'</tr>'));}

				
				

		    });
		    }

		    else {
		    	var r1 = '<td style="background:#333;color:#fff">#</td>'
		    	var r2 = '<td style="background:#333;color:#fff">&nbsp;</td>'
		    	var r3 = '<td style="text-align:center;background:#333;color:#fff">"No Votes in this Segment"</td>'
		    	table_obj.append($('<tr>'+r1+r2+r3+'</tr>'));
		    	table_obj2.append($('<tr>'+r1+r2+r3+'</tr>'));
		    }

	});


  // alert('Handler for .change() called.');
});






function pieHover(event, pos, obj) 
{
	if (!obj)
    return;
// console.log(this)
	value = obj.series.data[0][1]
	percent = parseFloat(obj.series.percent).toFixed(2);
	// $(this).append('<div>')
	$(this).find('.hover').html('<span style="font-weight: bold; color: '+obj.series.color+'">'+obj.series.label+' ('+value+' / '+percent+'%)</span>');
}

function pieClick(event, pos, obj) 
{
	if (!obj)
    return;
	percent = parseFloat(obj.series.percent).toFixed(2);
	alert(''+obj.series.label+': '+percent+'%');
}






