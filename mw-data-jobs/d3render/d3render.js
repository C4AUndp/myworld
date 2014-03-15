var express = require("express"),
	fs = require("fs"),
	phantom = require("phantom");

var app = express(),
	port = 8801;

var data = {
	"world": require("./data/world.json"),
	"stats": require("./data/stats.json")
};

var page;

phantom.create(function(ph) {
	ph.createPage(function(pg) {
		pg.open("./vis.html", function(status) {
			if (status != "fail") {
				page = pg;

				page.evaluate("update", null, data);

			}
		});
	});
});



// ****************************************************** routing

app.get("/", function(req, res) {

	var params = req.query; // the parameters passed to the vis comes from the querystring

	// convert data to proper types
	for (var k in params) {
		if (params[k].indexOf(",") != -1) {
			params[k] = params[k].split(",");
		}
	}

	page.evaluate("personalize", function(ret) {
		renderElement(page, "#vis", function(png) {
			res.send("<!DOCTYPE html><html><body><img src='data:image/png;base64,"+png+"' /></body></html>");
		});
	}, params);

});

// ****************************************************** runtime

app.listen(port);
console.log("Listening on port "+port);

// ****************************************************** render functions

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