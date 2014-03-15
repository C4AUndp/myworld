<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
 <?php  
 error_reporting(E_ALL);
ini_set('display_errors', '1');
 
session_start();
 if(!$_SESSION['logged']){
   header("Location: index.php");
    exit;
}?>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>MyWorld Partner System - Partner List</title>
		<link rel="stylesheet" type="text/css" href="style.css">
		<link rel="stylesheet" type="text/css" href="reset.css">
		<link rel="stylesheet" href="css/style.css" type="text/css" media="screen">
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
	<script>window.jQuery || document.write("<script src='js/jquery-1.8.0.min.js'>\x3C/script>")</script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script><script>window.jQuery.ui || document.write("<script src='js/jquery-ui-1.8.23.custom.min.js'>\x3C/script>")</script>
	
	</head>
	
	<body>
	<div id="wrapper">
			<a href="volunteers.php"><img src="images/logo.png" width="150" alt="logo"></a>
<!--Display Username Associated with ID-->
			<h1>Partner System</h1>
<div id="medialink" style="float: right; position: absolute; top: 82px; right: 8px;"></div>
<?php


if($_SESSION['admin'] == '1'){
			?><script>$("#medialink").html("<a href='volunteers.php' class='active'>Partner Listing</a> | <a href='form.php'>Online Submission Form</a> | <a href='media.php'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload2.php'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
			<?php
		}else{
			?><script>$("#medialink").html("<a href='media.php'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='form.php'>Online Submission Form</a> | <a href='upload.php'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
			<?php
		} 	
?>
			<p style="color: #2E2E2E; font-size: 12pt; line-height:1.5em; font-style: normal; margin: 0 80px 30px 0px;">
Click on any field to edit. Click on <img src="images/delete.png"> to delete a record. Click on <img src="images/notify.jpg"> to resend login information to a partner.</p>
			<!--<div id="message"><a href="registeradmin.php">Add a partner</a></div>-->
			<a href="registeradmin.php" style="font-weight:bold;"><input class="btn_index" style="cursor:pointer;" name="submit" type="submit" value="Add Partner"></button></a>&nbsp;&nbsp;
			<a href="export_partners.php" style="font-weight:bold;" target="_new"><input class="btn_index" style="cursor:pointer;" name="submit" type="submit" value="Download Partner List (CSV format)"></button></a><br><br>
			<div id="tablecontent"></div>
		<!--<div id="wrap">-->
		
			<!-- Feedback message zone 
			<div id="message"></div>-->

			<!-- Grid contents
			<div id="tablecontent"></div>-->
		
			<!-- Paginator control 
			<div id="paginator"></div>-->
		<!--</div>  -->
		
		<script src="js/editablegrid-2.0.1.js"></script>   
		<!-- I use jQuery for the Ajax methods -->
		<script src="js/jquery-1.7.2.min.js" ></script>
		<script src="js/volunteers.js" ></script>

		<script type="text/javascript">
			window.onload = function() { 
				datagrid = new DatabaseGrid();
			}; 
		</script>
		</div>
	</body>

</html>
