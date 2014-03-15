<?php
//error_reporting(E_ALL);
//ini_set('display_errors', '1');
require_once "/usr/share/pear/Mail.php";

session_start();
if(!$_SESSION['logged']){
    header("Location: index.php");
   exit;
} 


?>
<!-- Start your HTML/CSS/JavaScript here -->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>MyWorld Partner System - CSV Upload</title>
	
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
		
			<a href="media.php"><img src="images/logo.png" width="150" alt="logo"></a>
<!--Display Username Associated with ID-->
			<h1>Partner System</h1>
		

<div id="medialink" style="float: right; position: absolute; top: 80px; right: 30px;"></div>
<?php
if($_SESSION['admin'] == '1'){
			?><script>$("#medialink").html("<a href='volunteers.php'>Partner Listing</a> | <a href='form.php' onclick='return false'>Online Submission Form</a> | <a href='media.php'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload2.php' class='active'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
			<?php
		}else{
			?><script>$("#medialink").html("<a href='form.php' onclick='return false'>Online Submission Form</a> | <a href='media.php'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload.php' class='active'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
			<?php
		} 	
?>	
<div id="admin" style="width: 95%;">
<!--Scout ID 8 digit letters and numbers-->
			<div id="scout_admin">
			<h2>Ballot Data CSV Upload</h2><br><br>
			<table style="width: 100%;">
			<!--<p style="color: #5E5E5E; font-size: 10pt; font-style: normal; margin: 0 0 30px;">Ballot data CSV upload feature is coming soon.<br><br>
For now, please email completed spreadsheets to <a href="mailto:support@mworld2015.org">support@mworld2015.org</a>.</p>-->
<p style="color: #5E5E5E; font-size: 10pt; font-style: normal; margin: 0 0 30px;">Ballot Data CSV upload feature is coming soon.  In the meantime, please email any completed CSV files to <a href="mailto:support@myworld2015.org">support@myworld2015.org</a></p>
			</table>
			
			
				
				
		
		
		
	</div>
</body>
</html>
