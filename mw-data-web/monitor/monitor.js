
var dbName = "myworld_master2",
	collection = "votes",
	apiUrl = "https://api.mongolab.com/api/1/databases/",
	apiKey = "4fbbf12de4b02039bec59d81",
	count = null,
	currentPage = 0,
	perPage = 100,
	showHeaders = [
		"#",
		"data_quality",
		"data_quality_notes",
		"sourceMethod",
		"timestamp",
		"choices",
		"country",
		"age",
		"gender",
		"education",
		"partner",
		"sourceDetail",
		"sourceNotes",
		"original_values",
		"_id"

	];

$(document).ready(function() {

	// form controls
	var today = new Date();
	today = today.getFullYear() + "-" + (today.getMonth()+1) + "-" + today.getDate();

	$("#since-date").val(today);
	$("#search").click(function() { getResults({ op: "start" }); return false; });
	$("#getStats").click(function() { getResults({ op: "stats" }); return false; });

	// pager controls
	$("#prev").click(function() { getResults({ op: "previous" }); return false; });
	$("#next").click(function() { getResults({ op: "next" }); return false; });

	getResults({});

});

function getResults(options) {

	switch (options.op) {
		case "start":
			currentPage = 0;
			statsMessage("");
			break;
		case "previous":
			currentPage = (currentPage > 0) ? currentPage - 1 : 0;
			break;
		case "next":
			currentPage ++;
			break;
	}

	// **** get form controls
	// quality values
	var quality_values = [];
	$(".data-quality:checked").each(function() { quality_values.push(parseInt($(this).val())); });
	// source values
	var source_methods = [];
	$(".source-method:checked").each(function() { source_methods.push($(this).val())});
	if (source_methods.length == $(".source-method").length) source_methods = null; // if all checked, do not filter for this

	// date
	var date = $("#since-date").val();

	// **** create query
	// searches
	var searches = [];
	if (source_methods) searches.push(" sourceMethod: { '$in': "+JSON.stringify(source_methods)+" }");
	if (date.length > 0) searches.push("timestamp: { '$gt': { '$date':'"+date+"T00:00:00.000Z' } }");
	var searchesNoQualty = searches.slice(0);
	if (quality_values.length > 0) searches.push("data_quality : { '$in': "+JSON.stringify(quality_values)+" }");
	// query
	var fields = "{ data_quality: 1, data_quality_notes: 1, partner: 1, timestamp: 1, country: 1, age: 1, gender: 1, education: 1, choices: 1, sourceMethod: 1, sourceDetail: 1, sourceNotes: 1, original_values: 1 }";

	if (options.op == "stats") {

		var queries = [
			{ k: "countAll", q: buildQueryUrl(searchesNoQualty, null, null, null, null, true) },
			{ k: "countQual0", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:{ '$exists':false}"]), null, null, null, null, true) },
			{ k: "countQual1", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:1"]), null, null, null, null, true) },
			{ k: "countQual-1", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:-1"]), null, null, null, null, true) },
			{ k: "countQual-2", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:-2"]), null, null, null, null, true) },
			{ k: "countQual-3", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:-3"]), null, null, null, null, true) },
			{ k: "countQual-4", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:-4"]), null, null, null, null, true) },
			{ k: "countQual-5", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:-5"]), null, null, null, null, true) },
			{ k: "countQual-6", q: buildQueryUrl(searchesNoQualty.concat(["data_quality:-6"]), null, null, null, null, true) },
		];

		statsMessage("...");

	} else {

		var queries = [
			{ k: "countTotal", q: buildQueryUrl(searches, null, null, null, null, true) },
			{ k: "dataQuery", q: buildQueryUrl(searches, fields, "{ timestamp: -1 }", currentPage*perPage, perPage, false) }
		];

		message("Loading data...");
		count = null;
		$("#results").empty();

	}
		
	fetchNext(queries, {}, options);

}

function fetchNext(queries, data, options) {
	// more queries
	if (queries.length > 0) {
		var query = queries.shift();
		$.getJSON(query.q, function(response) {
			data[query.k] = response;
			fetchNext(queries, data, options);
		});
	} 
	// finished
	else {
		if (options.op == "stats") {
			drawStats(data);
		} else {
			processData(data);
		}
	}
}

function processData(data) {
	console.log(data);
	if (data.countTotal === 0) {
		$("#pager").text("");
		message("No results found.");
	} else {
		$("#pager").text(currentPage+1);
		message("Found "+data.countTotal+" results");
		drawTable(data.dataQuery, showHeaders);
	}	
}

function buildQueryUrl(find, fields, sort, skip, limit, count) {
	var qstring = [];
	console.log(find);
	if (find) qstring.push("q=" + "{" + find.join(", ") + "}");
	if (fields) qstring.push("f="+fields);
	if (sort) qstring.push("s="+sort);
	if (skip) qstring.push("sk="+skip);
	if (limit) qstring.push("l="+limit);
	if (count) qstring.push("c=true");
	return url = apiUrl+dbName+"/collections/"+collection+"?apiKey="+apiKey+"&"+qstring.join("&");
}

function message(msg) {
	if (msg)
		$("#message").text(msg).show();
	else
		$("#message").text("").hide();
}

function statsMessage(msg) {
	$("#stats .val").text(msg);
}

function drawStats(data) {
	for(k in data) {
		var val = parseInt(data[k]);
		if (k != "countAll" && data[k] > 0) val += " (" + Math.round(100 * data[k] / data["countAll"]) + "%)";
		$("#stats #"+k).find(".val").text(val);
	}
}

function drawTable(arr, headers) {

	var table = $("<table cellspacing='0' cellpadding='0' border='0'></table>").appendTo("#results");

	if (!headers) {
		headers = ["#"];
		for(k in arr[0]) {
			headers.push(k);
		}
	}


	var tr = $("<tr></tr>");
	for (h in headers) {
		tr.append("<th>"+headers[h]+"</th>");
	}
	table.append(tr);

	var count = perPage * currentPage;
	for(i in arr) {
		count ++;
		var row = arr[i];
		var tr = $("<tr></tr>");
		for (h in headers) {

			var val = row[headers[h]];

			// special value adjustments
			if (headers[h] == "#") { val = count; }
			else if (headers[h] == "_id") { val = val["$oid"]; }
			else if (headers[h] == "timestamp") { val = (val && val["$date"]) ? val["$date"] : ""; }
			else if (headers[h] == "choices") { val = (val && typeof(val)=="object") ? val.join(", ") : ""; }
			else if (headers[h] == "country") { 
				if (val) {
					var country = keys.country[val] ? keys.country[val] : "unknown";
					val = val + " ("+country+")"; 
				}
			}
			if (!val) val = "";

			// cell highlighting
			var cls = null;
			if (row["data_quality"] == -1 && headers[h] == "partner") cls = "error";
			else if (row["data_quality"] == -4 && headers[h] == "choices") cls = "error";
			else if (headers[h] == "data_quality") cls = "quality"+row[headers[h]];

			tr.append("<td class='"+cls+"'>"+val+"</td>");
		}
		table.append(tr);
	}

}

var keys = {
	"gender": {
		1: "male",
		2: "female",
		"all": "both"
	},
	"country": {
		1: "Afghanistan",
		2: "Albania",
		3: "Algeria",
		4: "Andorra",
		5: "Angola",
		6: "Antigua and Barbuda",
		7: "Argentina",
		8: "Armenia",
		9: "Australia",
		10: "Austria",
		11: "Azerbaijan",
		12: "Bahamas",
		13: "Bahrain",
		14: "Bangladesh",
		15: "Barbados",
		16: "Belarus",
		17: "Belgium",
		18: "Belize",
		19: "Benin",
		20: "Bhutan",
		21: "Bolivia",
		22: "Bosnia and Herzegovina",
		23: "Botswana",
		24: "Brazil",
		25: "Brunei Darussalam",
		26: "Bulgaria",
		27: "Burkina Faso",
		28: "Burundi",
		29: "Cambodia",
		30: "Cameroon",
		31: "Canada",
		32: "Cape Verde",
		33: "Central African Republic",
		34: "Chad",
		35: "Chile",
		36: "China",
		37: "Colombia",
		38: "Comoros",
		39: "Congo",
		40: "Costa Rica",
		41: "Cote d'Ivoire",
		42: "Croatia",
		43: "Cuba",
		44: "Cyprus",
		45: "Czech Republic",
		46: "Democratic People's Republic of Korea",
		47: "Democratic Republic of the Congo",
		48: "Denmark",
		49: "Djibouti",
		50: "Dominica",
		51: "Dominican Republic",
		52: "Ecuador",
		53: "Egypt",
		54: "El Salvador",
		55: "Equatorial Guinea",
		56: "Eritrea",
		57: "Estonia",
		58: "Ethiopia",
		59: "Fiji",
		60: "Finland",
		61: "France",
		62: "Gabon",
		63: "Gambia",
		64: "Georgia",
		65: "Germany",
		66: "Ghana",
		67: "Greece",
		68: "Grenada",
		69: "Guatemala",
		70: "Guinea",
		71: "Guinea-Bissau",
		72: "Guyana",
		73: "Haiti",
		74: "Honduras",
		75: "Hungary",
		76: "Iceland",
		77: "India",
		78: "Indonesia",
		79: "Iran",
		80: "Iraq",
		81: "Ireland",
		82: "Israel",
		83: "Italy",
		84: "Jamaica",
		85: "Japan",
		86: "Jordan",
		87: "Kazakhstan",
		88: "Kenya",
		89: "Kiribati",
		90: "Kuwait",
		91: "Kyrgyzstan",
		92: "Lao People's Democratic Republic",
		93: "Latvia",
		94: "Lebanon",
		95: "Lesotho",
		96: "Liberia",
		97: "Libya",
		98: "Liechtenstein",
		99: "Lithuania",
		100: "Luxembourg",
		101: "Madagascar",
		102: "Malawi",
		103: "Malaysia",
		104: "Maldives",
		105: "Mali",
		106: "Malta",
		107: "Marshall Islands",
		108: "Mauritania",
		109: "Mauritius",
		110: "Mexico",
		111: "Micronesia",
		112: "Monaco",
		113: "Mongolia",
		114: "Montenegro",
		115: "Morocco",
		116: "Mozambique",
		117: "Myanmar",
		118: "Namibia",
		119: "Nauru",
		120: "Nepal",
		121: "Netherlands",
		122: "New Zealand",
		123: "Nicaragua",
		124: "Niger",
		125: "Nigeria",
		126: "Norway",
		127: "Oman",
		128: "Pakistan",
		129: "Palau",
		130: "Panama",
		131: "Papua New Guinea",
		132: "Paraguay",
		133: "Peru",
		134: "Philippines",
		135: "Poland",
		136: "Portugal",
		137: "Qatar",
		138: "Republic of Korea",
		139: "Republic of Moldova",
		140: "Romania",
		141: "Russian Federation",
		142: "Rwanda",
		143: "Saint Kitts and Nevis",
		144: "Saint Lucia",
		145: "Saint Vincent and the Grenadines",
		146: "Samoa",
		147: "San Marino",
		148: "Sao Tome and Principe",
		149: "Saudi Arabia",
		150: "Senegal",
		151: "Serbia",
		152: "Seychelles",
		153: "Sierra Leone",
		154: "Singapore",
		155: "Slovakia",
		156: "Slovenia",
		157: "Solomon Islands",
		158: "Somalia",
		159: "South Africa",
		160: "South Sudan",
		161: "Spain",
		162: "Sri Lanka",
		163: "Sudan",
		164: "Suriname",
		165: "Swaziland",
		166: "Sweden",
		167: "Switzerland",
		168: "Syrian Arab Republic",
		169: "Tajikistan",
		170: "Thailand",
		171: "Macedonia",
		172: "Timor-Leste",
		173: "Togo",
		174: "Tonga",
		175: "Trinidad and Tobago",
		176: "Tunisia",
		177: "Turkey",
		178: "Turkmenistan",
		179: "Tuvalu",
		180: "Uganda",
		181: "Ukraine",
		182: "United Arab Emirates",
		183: "United Kingdom",
		184: "United Republic of Tanzania",
		185: "United States of America",
		186: "Uruguay",
		187: "Uzbekistan",
		188: "Vanuatu",
		189: "Venezuela",
		190: "Viet Nam",
		191: "Yemen",
		192: "Zambia",
		193: "Zimbabwe"
	}
};