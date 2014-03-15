var importUrl = "http://54.227.246.164/import/do/",
	mode = "production", // production | test -- set through querystring mode=test
	currentStep = "upload",
	importReady = false,
	showExampleRows = 500;

$(document).ready(function() {

	if (querystring("mode") == "test") {
		mode = "test";
	}

	changeStep("upload");
	$("#uploadfile").change(function() { changeReady(false); clearResults(); });	
	$("#submitUpload").click(function() { submitUpload(false) });
	$("#backToUpload").click(function() { changeStep("upload"); });
	$("#submitImport").click(function() { submitUpload(true) });
	$(".alert").alert();

	if (mode == "test") displayMessage("Using TEST mode");

});

// ************************************************ form functions

function changeStep(step) {

	$(".step").removeClass("active");
	$("#"+step+"-step").addClass("active");

	if (step == "upload") {
		changeReady(false);
		clearResults();

	}

}

function changeReady(setTo) {

	importReady = setTo;

	// ready
	if (importReady) {
		$("#importReady").show();
		$("#submitImport").removeAttr("disabled");
	}
	// not ready
	else {
		$("#importReady").hide();
		$("#submitImport").attr("disabled", "disabled");
	}

}

function submitUpload(doImport) {

	var fieldsValid = true;
	if ($("#sourcenote").val().length === 0) {
		$("#sourcenote").addClass("error");
		fieldsValid = false;
	} else {
		$("#sourcenote").removeClass("error");
	}
	if ($("#uploadfile").val().length === 0) {
		$("#uploadfile").addClass("error");
		fieldsValid = false;
	} else {
		$("#uploadfile").removeClass("error");
	}

	if (fieldsValid != true) return false;

	changeReady(false);
	clearResults();

	// fields all valid, so switch to validation step
	changeStep("validation");
	var msg = (doImport) ? "Importing votes..." : "Uploading file...";
	$("#output-title").text(msg);

	var formData = new FormData(document.getElementById("uploadForm"));

	// form values
	formData.append("sourcemethod", $("#sourcemethod").val());
	formData.append("sourcenote", $("#sourcenote").val());

	// test?
	if (mode == "test") formData.append("test", 1);

	// do import?
	if (doImport) formData.append("import", 1);

	// POST request
	$.ajax({
		url: importUrl,
		type: "POST",
		data: formData,
		success: function(res) {
			$("#output-title").text("File uploaded");
			if (typeof(res) == "string") res = JSON.parse(res);
			console.log(res);
			processResponse(res);
		},
		error: function(err) { 
			$("#output-title").text("Error uploading file.");
			console.log(err); 
		},
		cache: false,
		contentType: false,
		processData: false
	});	

	return false;
}

// get querystring
function querystring(key) {
	var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
	var r=[], m;
	while ((m=re.exec(document.location.search)) != null) r.push(m[1]);
	return r;
}

// ************************************************ data functions

function processResponse(res) {

	// process errors
	if (res.error) {
		displayMessage("Error: " + res.error, "error");
		changeStep("upload");
		return;
	}

	// process import
	if (res.import) {
		changeStep("upload");
		if (res.import.success == 1) {
			
			// clear form data
			$("#sourcenote").val("")
			$("#uploadForm")[0].reset();

			// success message
			dbMsg = (res.import.destination == "test") ? " into TEST database" : "";
			displayMessage(res.import.imported + " rows successfully imported" + dbMsg + ".", "success");

		}
		else {
			displayMessage("There was an error importing the votes.", "error");
		}
	}

	// process warnings 
	res.warningsProcessed = {
		rows: d3.map(),
		notes: d3.map()
	};
	if (res.warnings) {
		res.warnings.forEach(function(d) {
			
			// add row
			if (!res.warningsProcessed.rows.has(d.row)) {
				res.warningsProcessed.rows.set(d.row, { id: d.row, count: 0 });
			}
			res.warningsProcessed.rows.get(d.row).count ++;
			
			// add note
			if (!res.warningsProcessed.notes.has(d.note)) {
				res.warningsProcessed.notes.set(d.note, { id: d.note, count: 0, rows: d3.map() });
			}
			var n = res.warningsProcessed.notes.get(d.note);
			if (!n.rows.has(d.row)) {
				n.rows.set(d.row, { index: d.row, columns: [] });
				n.count ++;
			}
			n.rows.get(d.row).columns = n.rows.get(d.row).columns.concat(d.columns);

		});
	}

	// display validation
	displayValidation(res);

	if (res.errors.length === 0) {
		// ready for import
		changeReady(true);
	}

}

// ************************************************ display functions

// clear results
function clearResults() {

	$("#output-title").text($("#output-title").attr("default"));
	$("#output-results").empty();

}

// output alert message
function displayMessage(msg, type) {

	var alert = $("<div class='alert'></div>");

	alert.append("<a class='close' data-dismiss='alert' href='#'>&times;</a>");

	alert.append("<span class='message'>"+msg+"</span>");
	if (type) alert.addClass("alert-"+type);

	$("#messages").append(alert);

}

// output errors and warnings from validator
function displayValidation(d) {

	console.log(d);

	var titleContainer = $("#output-title"),
		resultsContainer = $("#output-results");

	titleContainer.empty();
	resultsContainer.empty();

	// has errors
	if (d.errors && d.errors.length > 0) {

		// title
		titleContainer.text("There were errors with the file.");

		// results
		d.errors.forEach(function(info) {
			var note = $("<div class='notice'></div>");
			note.html("<span class='note'>"+info+"</span>");
			resultsContainer.append(note);
		});

	} 
	// no errors
	else {

		var set = d.warningsProcessed,
			setRows = set.rows.values().length;

		// summarize totals
		titleContainer.append("<i class='header-icon icon-ok'></i>Errors: 0 rows");
		titleContainer.append("<br />");
		titleContainer.append("<i class='header-icon icon-flag'></i> Warnings: "+ setRows + " rows");
		titleContainer.append("<br /><small><em>Click each warning to review affected rows</em></small>")

		// summarize notes		
		var notes = set.notes.values().sort(function(a,b) { return b.count - a.count; });
		var groups = [];
		notes.forEach(function(info) {

			// heading
			var grp = { "heading": "<div class='header-tab header-tab-warning'></div>" + info.id + " <span class='validation-total'>" + info.count + " rows</span>" };
			
			// *** body	
			grp.body = "";
			
			// row examples
			// grp.body += "<h4>Example rows with this warning:</h4>";
			var exampleRows = info.rows.values().slice(0, showExampleRows),
				rowData = [];
			for(var i in exampleRows) { 
				rowData.push({ 
					index: exampleRows[i].index, 
					columns: exampleRows[i].columns,
					data: d.warningRows[exampleRows[i].index]
				});
			}
			grp.body += "<div class='exampleRow'>" + buildExampleRows(d.originalHeaders, rowData) + "</div>";

			// row numbers
			// grp.body += "<h4>All rows with this warning:</h4><p>" + info.rows.join(", ") + "</p>";			

			groups.push(grp);

		});
		resultsContainer.append(buildAccordion(groups, "validationDetails"));

	}

}

// build accordion
function buildAccordion(groups, id) {

	var accordion = $("<div class='accordion' id='"+id+"'></div>");

	var count = 0;
	for(var i in groups) {
		
		count++;

		var g = groups[i],
			groupId = id + "-" + count;

		var group = $("<div class='accordion-group'></div>");

		var heading = $("<div class='accordion-heading'></div>");
		heading.append("<a class='accordion-toggle collapsed' data-toggle='collapse' data-parent='#"+id+"' href='#"+groupId+"'>"+ g.heading + "</a>");
		group.append(heading);

		var body = $("<div class='accordion-body collapse' id='"+groupId+"'></div>");
		body.html("<div class='accordion-inner'>"+g.body+"</div>");
		group.append(body);

		accordion.append(group);

	}
	
	return accordion;

}

// build example rows table
function buildExampleRows(headers, rows) {

	var ret = "<table border='0' cellspacing='0' cellpadding='0' class='exampleRowsTable'>";

	// headers
	headers = headers.split(",");
	ret += "<thead>";
	ret += "<tr>";
	ret += "<th>1</th>";
	for (var k in headers) {
		ret += "<th>" + headers[k] + "</th>";
	}
	ret += "</tr>";
	ret += "</thead>";

	ret += "<tbody>";
	for (var i in rows) {
		
		// assemble row data into object
		var rowNum = rows[i].index,
			columns = rows[i].columns,
			cells = (rows[i].data) ? rows[i].data.split(",") : [];

		var highlightIndices = [];
		for(var ck in columns) {				
			var ind = headers.indexOf(columns[ck]);
			if (ind != -1) highlightIndices.push(ind);
		}

		// output row as html
		ret += "<tr>";
		ret += "<td class='rowindex'>" + (rowNum+2) + "</td>";
		for (var k in cells) {
			var cls = (highlightIndices.indexOf(parseInt(k)) != -1) ? 'highlight' : '';
			ret += "<td class='"+cls+"'>" + cells[k] + "</td>";
		}
		ret += "</tr>";		

	}
	ret += "</tbody>";

	ret += "</table>";

	return ret;
}






