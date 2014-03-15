<?php

session_start();
if(!$_SESSION['logged']){
    header("Location: index.php");
   exit;
} 

?>
<!DOCTYPE html>
<meta charset="utf-8">
<html lang="en">
<head>
<title>MY World Data Import</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="importCSV/bootstrap/css/bootstrap.min.css" rel="stylesheet" media="screen" />
<link href="importCSV/import.css" rel="stylesheet" media="screen" />
<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/d3/3.0.8/d3.min.js"></script>
</head>

<body>

<!--
<div class="container">
	<div id="wrapper" class="span12">
			
		<a href="form.php"><img src="images/logo.png" width="150" alt="logo"></a>
		<h1>Partner System</h1>
			

		<div id="medialink" style="float: right; position: absolute; top: 82px; right: 8px;"></div>
			<?php
			/*
			if($_SESSION['admin'] == '1'){
						?><script>$("#medialink").html("<a href='volunteers.php'>Partner Listing</a> | <a href='form.php'>Online Submission Form</a> | <a href='media.php'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload2.php' class='active'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
						<?php
					}else{
						?><script>$("#medialink").html("<a href='form.php'>Online Submission Form</a> | <a href='media.php'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload.php' class='active'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
						<?php
					} 	
			*/
			?>
		</div>

	</div>
</div>
-->

<!-- ****************************************************************** start import html -->

<div class="container">

	<!-- ****************************************************************** header -->

	<br />

	<div class="row">
		<div class="span12">
			<div id="backLink"><a href="form.php">back to main site</a></div>
			<h1>MY World Data Import</h1>
			<div id="messages"></div>
		</div>
	</div>

	<!-- ****************************************************************** upload section -->

	<div id="upload-step" class="step">

		<div class="row">

			<!-- ****************************************************************** upload form -->

			<div class="span6">

				<legend class="sectionTitle">Upload CSV File</legend>

				<div class="section">

					<div class="content">

						<form enctype="multipart/form-data" id="uploadForm">

							<div class="spacer">
								<label>Source Method</label>
								<select id="sourcemethod">
									<option value="offline">Paper Ballots (offline)</option>
									<option value="sms">SMS Survey</option>
								</select>
							</div>

							<div class="spacer">
								<label>Source Note</label>
								<small>Describe this upload, e.g.: "Collected in Ogun, Nigeria, March 2013."</small><br />
								<input style="width:380px;" type="text" id="sourcenote" />
							</div>

							<div class="spacer">
								<label>Select CSV File</label>
								<input type="file" id="uploadfile" name="csv" />
							</div>

						</form>

					</div>

					<div class="form-actions">					
						<button id="submitUpload" class="btn btn-primary">Upload and Validate</button>
						<small>The data will not be imported yet.</small>
					</div>

				</div>

			</div>

			<!-- ****************************************************************** instructions -->

			<div class="span6">

				<legend>Instructions</legend>
				<ol>
					<li>
						If your spreadsheet is in Excel or another format, export it as a CSV file.
					</li>
					<li>
						Fill in the form and upload your file. The validator will display any errors or warnings caused by the data.
					</li> 
					<li>
						You should then update your file to fix any of the problems encountered, and try validating again. In some cases, warnings cannot be fixed and should be uploaded anyway.
					</li>
					<li>
						Once your file has no errors and either has no warning or you are willing to ignore the warnings, click the green IMPORT button to upload and import the votes (it will be visible after validating).
					</li>
				</ol>

			</div>

		</div>

	</div>

	<!-- ****************************************************************** validation section -->

	<div id="validation-step" class="step">

		<div class="row">

			<div class="span12">

				<legend>Data Validation</legend>

				<h3 id="output-title" default="Upload a file to validate"></h3>

				<div id="output-results"></div>
				
				<div class="hero-unit hero-highlight">

					<small>Want to make changes?</small> <button id="backToUpload" class="btn btn-primary"><i class="icon-arrow-left icon-white"></i> Back to Upload</button>

					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

					<span id="importReady" style="display:none;"><small>Ready to import?</small> <button id="submitImport" class="btn btn-success" disabled><i class="icon-ok icon-white"></i> Import Votes</button></span>

				</div>
				<small>
					<span class="label">Note</span> You may import votes even if the validator produces warnings. First you investigate the warnings and determine whether any can be accurately corrected. For instance, if the file contains "male" instead of "1", you could replace the invalid values with the correct ones. Sometimes, these warnings cannot be fixed and the votes should just be imported anyway.
				</small>

			</div>

		</div>

	</div>

</div>


<script src="importCSV/bootstrap/js/bootstrap.min.js"></script>
<script src="importCSV/client.js"></script>

<!-- ****************************************************************** end import html -->
						
</body>
</html>