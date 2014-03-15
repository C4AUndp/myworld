<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');



?>
<!-- Start your HTML/CSS/JavaScript here -->
<script>
function english() {
$(".language").css("font-weight", "normal");
$("#english").css("font-weight", "bold");
$("#files").html('<h2>English</h2><table style="width: 100%;"><tr><td><h2>Excel Files</h2><a href="media/xls/myworld_results_spreadsheet_updated20130110.xls"><img src="images/excel.png">  MY World Ballot Data Template</a><br><br><br><h2>Illustrator Files</h2><a href="media/ai/myworld_ballot_A4_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br><a href="media/ai/myworld_ballot_postcard.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br><a href="media/ai/myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br></td><td><h2>PDF Files</h2>	<a href="media/pdf/myworld_ballot_A4_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br><a href="media/pdf/myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br><a href="media/pdf/myworld_ballot_postcard.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br><a href="media/pdf/myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br><br></td></tr></table>');
}

function spanish() {
$(".language").css("font-weight", "normal");
$("#spanish").css("font-weight", "bold");
$("#files").html('<h2>Spanish - Coming Soon</h2>');
}
</script>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>MyWorld Partner System - HOW TO Guides</title>
	
	<link rel="stylesheet" type="text/css" href="reset.css">
	<link rel="stylesheet" type="text/css" href="style.css">

<!--replace with prefered version of jQuery or other library & make a local copy-->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
	<script>window.jQuery || document.write("<script src='js/jquery-1.8.0.min.js'>\x3C/script>")</script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script><script>window.jQuery.ui || document.write("<script src='js/jquery-ui-1.8.23.custom.min.js'>\x3C/script>")</script>

<!--Conditional comments-->

	<!--[if IE 7]>
	<link rel="stylesheet" type="text/css" href="ie7.css">
	<![endif]-->
	<!--[if IE 8]>
	<link rel="stylesheet" type="text/css" href="ie9.css">
	<![endif]-->
	<!--[if IE 9]>
	<link rel="stylesheet" type="text/css" href="ie9.css">
	<![endif]-->

	

	
</head>
<body>
	<div id="wrapper">
		
			<a href="form.php"><img src="images/logo.png" width="150" alt="logo"></a>
<!--Display Username Associated with ID-->
			<h1>Partner System</h1>
		<p style="color: #5E5E5E; font-size: 10pt; font-style: normal; margin: 0 0 30px;">
Please download the printable ballot, ballot data entry spreadsheet and complimentary materials below:</p>

<div id="admin" style="width: 95%;">
<!--Scout ID 8 digit letters and numbers-->
			<div id="scout_admin">
			<h2>HOW TO GUIDES</h2><br><br>
			<div id="languages"><h2 style="font-weight: normal; color: #22222;"><span id="english" class="language" style="font-weight: bold;" onclick="english();">ENGLISH</span> | <span id="spanish" class="language" onclick="spanish();">SPANISH</span> | <span id="french" class="language" onclick="french();">FRENCH</span> | <span id="russian" class="language" onclick="russian();">RUSSIAN</span> | <span id="arabic" class="language" onclick="arabic();">ARABIC</span> | <span id="chinese" class="language" onclick="chinese();">CHINESE</span> | <span id="korean" class="language" onclick="korean();">KOREAN</span></h2></div> 

			<div id="files">
		     <!-- <h2>English</h2>-->
				<table style="width: 100%;">
					<tr><td>
					<h2>Excel Files</h2>
					<a href="media/xls/myworld_results_spreadsheet_updated20130110.xls"><img src="images/excel.png">  MY World Ballot Data Template</a><br><br><br>
					<h2>Illustrator Files</h2>
					<a href="media/ai/myworld_ballot_A4_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
					<a href="media/ai/myworld_ballot_postcard.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
					<a href="media/ai/myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br></td><td>
					<h2>PDF Files</h2>
					<a href="media/pdf/myworld_ballot_A4_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
					<a href="media/pdf/myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
					<a href="media/pdf/myworld_ballot_postcard.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
					<a href="media/pdf/myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br><br></td></tr></table>
		</div>		
			
			
				
				
		
		
		
	</div>
</body>
</html>