var http = require("http"),
	express = require("express"),
	fs = require("fs"),
	phantom = require("phantom"),
	fs = require("fs");

var app = express(),
	port = 8801,
	log = "./log/myworld.txt";

var data = {
	langs: {
		ar: require("./langs/ar.json"),
		ch: require("./langs/ch.json"),
		en: require("./langs/en.json"),
		es: require("./langs/es.json"),
		fr: require("./langs/fr.json"),
		kr: require("./langs/kr.json"),
		pr: require("./langs/pr.json"),
		ru: require("./langs/ru.json"),
		th: require("./langs/th.json"),
		vt: require("./langs/vt.json")
	},
	segments: {},
	segmentOrder: [ "world", "male", "female", "age1", "age2", "age3", "hdi1", "hdi2", "hdi3", "hdi4" ],
	choiceOptions: [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ],
	worldmap: require("./data/world.json"),
	mapstats: null
};

// ****************************************************** vis drawing and updating

var pages = {};

phantom.create(function(ph) {
	ph.createPage(function(pg) {
		pg.open("./vis-myworld.html", function(status) {
			if (status != "fail") {
				pages.segments = pg;
			}
		});
	});
});

phantom.create(function(ph) {
	ph.createPage(function(pg) {
		pg.open("./vis-myworld-map.html", function(status) {
			if (status != "fail") {
				pages.map = pg;
			}
		});
	});
});

// update stats
updateStats();
setInterval(updateStats, 1000*60*5);
updateMapStats();
setInterval(updateMapStats, 1000*60*12);


// ****************************************************** routing

app.get("/segments", function(req, res) {

	var params = req.query; // the parameters passed to the vis comes from the querystring

	// convert input to proper types
	for (var k in params) {

		// convert arrays
		if (params[k].indexOf(",") != -1) {
			params[k] = params[k].split(",");
		}
		// convert ints
		else if (typeof(params[k]) == "string") {
			var i = parseInt(params[k]);
			if (!isNaN(i)) params[k] = i;
		}
	}

	// validation
	if (params.country && !validateNumber(params.country, 1, 194)) delete params.country;
	if (params.gender && !validateNumber(params.gender, 1, 2)) delete params.gender;
	if (params.age && !validateNumber(params.age, 1, 140)) delete params.age;

	// vis mode
	var mode = (typeof(params["votes"]) == "object") ? "thankyou" : "results";

	// make sure necessary inputs are here
	if (!mode == "thankyou") {
		if (!params["age"] || !params["gender"] || !params["country"] || !params["votes"]) {
			res.send("Error: missing parameters.");
			return;
		}
	}

	// data to pass to draw function
	var d = {
			mode: mode,
			segments: []
		};

	// language
	d.lang = (params["lang"] && data.langs[params["lang"]]) ? data.langs[params["lang"]] : data.langs.en;

	// global segment data
	for (var k in data.segmentOrder) {
		if (data.segments[data.segmentOrder[k]]) d.segments.push(data.segments[data.segmentOrder[k]]);
	}

	// assemble votes
	if (params.votes) {
		d.userChoices = [];
		var remainingChoices = data.choiceOptions.slice(0);
		for(var i in params.votes) {
			var v = parseInt(params.votes[i]);
			if (remainingChoices.indexOf(v) > -1) {
				d.userChoices.push(v);
				remainingChoices.splice(remainingChoices.indexOf(v), 1);
			}
		}
		d.userChoices_others = d.userChoices.concat(remainingChoices);
	} else {
		d.userChoices = [];
		d.userChoices_others = data.choiceOptions.slice(0);
	}

	// add params to data
	d.user = params;

	// log
	logLine(["segments", params]);

	// render function
	var rend = function() {
		if (params["raw"]==1) {
			res.send(JSON.stringify(d));
		} else {
			pages.segments.evaluate("draw", function(ret) {
				renderElement(pages.segments, "#vis", function(png) {
					imageResponse(res, png);
				});
			}, d);
		}
	}

	// thankyou mode
	if (mode == "thankyou") {

		// get custom segment data
		getData("custom", params, function(r, options) { 
			d.customSegment = { title: "Custom", id: "custom", values: r };
			// get country segment data
			getData("country", params, function(r, options) {
				// insert into segments
				d.segments.splice(1, 0, { title: "Country", id: "country", values: r });
				rend();
			});
		});

	} 
	// results mode
	else {

		rend();

	}


});


app.get("/map", function(req, res) {

	var params = req.query; // the parameters passed to the vis comes from the querystring

	var d = {
		world: data.worldmap,
		stats: data.mapstats
	};

	// language
	d.lang = (params["lang"] && data.langs[params["lang"]]) ? data.langs[params["lang"]] : data.langs.en;

	// log
	logLine(["map", params]);

	if (params["raw"]==1) {
		res.send(JSON.stringify(d));
	} else {
		pages.map.evaluate("update", function(ret) {
			renderElement(pages.map, "#vis", function(png) {
				imageResponse(res, png);
			});
		}, d);
	}

});

// ****************************************************** get data from MY World api

function updateStats() {

	var queries = [
		{ k: "world", t: "World", q: "" },
		{ k: "male", t: "Male", q: "gender=1" },
		{ k: "female", t: "Female", q: "gender=2" },
		{ k: "age1", t: "≤34", q: "age_ub=34" },
		{ k: "age2", t: "35-54", q: "age_lb=35&age_ub=54" },
		{ k: "age3", t: "≥55", q: "age_lb=55" },
		{ k: "hdi1", t: "Low", q: "hdi=1" },
		{ k: "hdi2", t: "Medium", q: "hdi=2" },
		{ k: "hdi3", t: "High", q: "hdi=3" },
		{ k: "hdi4", t: "Very High", q: "hdi=4" }
	];

	for(var i in queries) {
		var query = queries[i];
		getData("normal", { "table": "segment", "query": query }, function(r, options) {
			data.segments[options.query.k] = {
				id: options.query.k,
				title: options.query.t,
				values: r
			};
		});
	}

}

function updateMapStats() {

	var options = {};

	getData("normal", { "table": "map", "query": "" }, function(r, options) {
		data.mapstats = r;
	});

}

function getData(op, options, callback) {
	if (!op || !options) return;

	var queries = [];
	if (op == "country" && options.country) {
		queries.push("country="+options.country);
		options.table = "segment";
	} 
	else if (op == "custom") {
		if (options.country) queries.push("country="+options.country);
		if (options.gender) queries.push("gender="+options.gender);
		if (options.age) {
			if (options.age < 35) { queries.push("age_ub=34"); }
			else if (options.age > 34 && options.age < 55) { queries.push("age_lb=35&age_ub=54"); }
			else if (options.age > 54) { queries.push("&age_lb=55"); }
		}
		options.table = "segment";
	}
	else if (op == "normal" && options.query) {
		queries.push(options.query.q);		
	}

	if (!options.table) {
		console.log("Query error: no table specified")		
		callback(null, options);
	}
	querystring = queries.join("&");

	var r = {
		host: "127.0.0.1",
		// port: 3013,
		path: "/stats/public/"+options.table+"?"+querystring,
		headers: { "Content-Type" : "application/json" }
	};

	var req = http.get(r, function(res) {
		var output = "";
		res.setEncoding("utf8");
		res.on("data", function(chunk) { output += chunk; });
		res.on("end", function() {
			var obj = null;
			try {
				obj = JSON.parse(output);
			}
			catch(err) {
				console.log("Error parsing data: "+options.query.q);
				console.log(err);
				obj = null;
			}
			callback(obj, options);

		})
	});

	req.on("error", function(err) {
		console.log("API error");
		console.log(err);
	});

}


// ****************************************************** runtime

app.listen(port);
console.log("Listening on port "+port);


// ****************************************************** render functions

// write to log
function logLine(arr) {
	if (!typeof(arr) == "object") arr = [arr];
	
	for (var k in arr) {
		if (typeof(arr[k]) == "object") {
			arr[k] = JSON.stringify(arr[k]);
		}
	}

	var now = new Date();
	arr.unshift(now.toString());

	fs.appendFile(log, arr.join("|")+"\n");

}

// ****************************************************** render functions

function imageResponse(res, imageData) {
	var bin = new Buffer(imageData, "base64").toString("binary");
	res.writeHead(200, { "Content-Type:": "image/png" });
	res.write(bin, "binary");
	res.end();
}

function renderElement(page, selector, callback) {
	var prevClipRect = page.clipRect;
	page.clipRect = page.evaluate(function(selector) {
		return document.querySelector(selector).getBoundingClientRect();
	}, function() {
		page.renderBase64("png", function(pic) {
			page.clipRect = prevClipRect;
			callback(pic);
		});
	}, selector);
}

// ****************************************************** validation functions

function validateNumber(v, min, max) {
	v = parseInt(v);
	if (isNaN(v)) return false;
	if (v < min || v > max) return false;
	return true;
} 


