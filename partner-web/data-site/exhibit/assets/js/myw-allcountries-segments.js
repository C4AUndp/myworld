var list = "assets/data/default.json"
var countries = [];

$.getJSON(list, function(data) {
		countries = data.fields_values.countries;
})

var callSegment = function (api, cid) {
	// console.log(api)
	$.getJSON(api, function(jdata) {
	    
	    var m = $.grep(countries, function(e) { return e.id == cid });
	    // console.log(jdata.rankings.length)
	    for (var i=0; i<jdata.rankings.length; i++){
	    // console.log(m[0].name)
		$("#myw-list").append(jdata.rankings[i].count+",")
		$("#myw-list").append(m[0].name+",")
		$("#myw-list").append(jdata.rankings[i].pri_id+",")
		$("#myw-list").append(jdata._total)
		$("#myw-list").append("<br>")
		}
		
	});
}

for (var i=1; i<196; i++){
	var api2 = "http://54.227.246.164/stats2/"
	var sapi = api2 + "segment?country=" + i;
	callSegment(sapi, i);
	
}


