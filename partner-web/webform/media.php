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
	<title>MyWorld Partner System - Downloads</title>
	
	<link rel="stylesheet" type="text/css" href="reset.css">
	<link rel="stylesheet" type="text/css" href="style.css">
	<style>li.ui-tabs-active a { font-weight:bold; }</style>

<!--replace with prefered version of jQuery or other library & make a local copy-->
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.min.js"></script>
	<script>window.jQuery || document.write("<script src='js/jquery-1.8.0.min.js'>\x3C/script>")</script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js"></script><script>window.jQuery.ui || document.write("<script src='js/jquery-ui-1.8.23.custom.min.js'>\x3C/script>")</script>
	<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.0/themes/base/jquery-ui.css" />
	<script src="http://code.jquery.com/jquery-1.8.3.js"></script>
	<script src="http://code.jquery.com/ui/1.10.0/jquery-ui.js"></script>

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
<script>
 $(function() {
$( "#tabs" ).tabs();
});
</script>
	

	
</head>
<body>
	<div id="wrapper">
		
			<a href="media.php"><img src="images/logo.png" width="150" alt="logo"></a>
<!--Display Username Associated with ID-->
			<h1>Partner System</h1>
		<p style="color: #2E2E2E; font-size: 12pt; line-height:1.5em; font-style: normal; margin: 0 80px 30px 0px;">
Please download the printable ballot and complimentary materials below:</p>

<div id="medialink" style="float: right; position: absolute; top: 82px; right: 8px;"></div>
<?php
if($_SESSION['admin'] == '1'){
			?><script>$("#medialink").html("<a href='volunteers.php'>Partner Listing</a> | <a href='form.php' onclick='return false'>Online Submission Form</a> | <a href='media.php' class='active'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload2.php'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
			<?php
		}else{
			?><script>$("#medialink").html("<a href='form.php' onclick='return false'>Online Submission Form</a> | <a href='media.php' class='active'>Printable Ballot Cards</a> | <a href='spreadsheet.php'>Template Spreadsheet</a> | <a href='upload.php'>Upload Spreadsheet</a> | <a href='index.php'>Logout</a>");</script>
			<?php
		} 	
?>
<div id="admin" style="width: 95%;">
<!--Scout ID 8 digit letters and numbers-->
			<div id="scout_admin">
			<div id="files">
			<div id="tabs">
					<ul>
					<li><a href="#english">English</a></li>
					<li><a href="#spanish">Spanish</a></li>
					<li><a href="#french">French</a></li>
					<li><a href="#russian">Russian</a></li>
					<li><a href="#arabic">Arabic</a></li>
					<li><a href="#chinese">Chinese</a></li>
					<li><a href="#korean">Korean</a></li>
					<li><a href="#portugese">Portugese</a></li>
					<li><a href="#thai">Thai</a></li>
					</ul>
					<div id="english">
						<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/english/AI/myworld_ballot_A4_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/english/AI/myworld_ballot_A4_foldinhalf.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/english/AI/Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/english/AI/myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br>
							<h2>PDF Files</h2>
							<a href="media/english/PDF/myworld_ballot_A4_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/english/PDF/myworld_ballot_A4_foldinhalf.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/english/PDF/myworld_ballot_postcard.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/english/PDF/myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br></td><td>
							<h2>Word Files</h2>
							<a href="media/english/DOC/English MYWorld Ballot - A4.doc"><img src="images/doc.jpg">  MY World Ballot - A4</a><br>
							<a href="media/english/DOC/English MYWorld Ballot - Fold in half.doc"><img src="images/doc.jpg">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/english/DOC/English MYWorld Ballot - Postcard.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>
							<a href="media/english/DOC/English MYWorld Ballot - Priorities Supporting Information.doc"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table>
					</div>
					<div id="spanish">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/spanish/AI/ES_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/spanish/AI/ES_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/spanish/AI/ES_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/spanish/AI/ES_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br>
							<h2>PDF Files</h2>
							<a href="media/spanish/PDF/ES_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/spanish/PDF/ES_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/spanish/PDF/ES_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/spanish/PDF/ES_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br> </td><td>
							<h2>Word Files</h2>
							<a href="media/spanish/DOC/ES_myworld_ballot_A4_twosided_2.doc"><img src="images/doc.jpg">  MY World Ballot - A4</a><br>
							<a href="media/spanish/DOC/myworld_ballot_A4_foldinhalf_2_180rotated.doc"><img src="images/doc.jpg">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/spanish/DOC/ES_Paper_Ballot_pledge_edits_2.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>
							<a href="media/spanish/DOC/ES_myworld_priorities_info.doc"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table></div>
					<div id="french">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/french/AI/FR_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/french/AI/FR_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/french/AI/FR_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/french/AI/FR_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br>
							<h2>PDF Files</h2>
							<a href="media/french/PDF/FR_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/french/PDF/FR_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/french/PDF/FR_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/french/PDF/FR_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br> </td><td>
							<h2>Word Files</h2>
							<a href="media/french/DOC/FR_myworld_ballot_A4_twosided_2.doc"><img src="images/doc.jpg">  MY World Ballot - A4</a><br>
							<a href="media/french/DOC/myworld_ballot_A4_foldinhalf_2_180rotated.doc"><img src="images/doc.jpg">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/french/DOC/FR_Paper_Ballot_pledge_edits_2.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>
							<a href="media/french/DOC/FR_myworld_priorities_info.doc"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table></div>
					<div id="russian">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/russian/AI/RU_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/russian/AI/RU_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/russian/AI/RU_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/russian/AI/RU_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br>
							<h2>PDF Files</h2>
							<a href="media/russian/PDF/RU_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/russian/PDF/RU_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/russian/PDF/RU_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/russian/PDF/RU_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br></td><td>
							<h2>Word Files</h2>
							<a href="media/russian/DOC/RU_myworld_ballot_A4_twosided_2.doc"><img src="images/doc.jpg">  MY World Ballot - A4</a><br>
							<!--<a href="media/russian/DOC/myworld_ballot_A4_foldinhalf_2_180rotated.doc"><img src="images/doc.jpg">  MY World Ballot - A4 - Fold in Half</a><br>-->
							<a href="media/russian/DOC/RU_Paper_Ballot_pledge_edits_2.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>
							<a href="media/russian/DOC/RU_myworld_priorities_info.doc"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table></div>
					<div id="arabic">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/arabic/AI/AR_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/arabic/AI/AR_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/arabic/AI/AR_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/arabic/AI/AR_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br>
							<h2>PDF Files</h2>
							<a href="media/arabic/PDF/AR_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/arabic/PDF/AR_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/arabic/PDF/AR_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/arabic/PDF/AR_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br> </td><td>
							<h2>Word Files</h2>
							<a href="media/arabic/DOC/MyWorld_ballot_A4_2_ARABIC-final.docx"><img src="images/doc.jpg">  MY World Ballot - A4</a><br>
							<!--<a href="media/arabic/DOC/myworld_ballot_A4_foldinhalf_2_180rotated.doc"><img src="images/doc.jpg">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/arabic/DOC/RU_Paper_Ballot_pledge_edits_2.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>-->
							<a href="media/arabic/DOC/My priorities_ARABIC.docx"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table></div>
					<div id="chinese">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/chinese/AI/CHN_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/chinese/AI/CHN_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/chinese/AI/CHN_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/chinese/AI/CHN_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br>
							<h2>PDF Files</h2>
							<a href="media/chinese/PDF/CHN_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/chinese/PDF/CHN_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/chinese/PDF/CHN_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/chinese/PDF/CHN_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br> </td><td>
							<h2>Word Files</h2>
							<a href="media/chinese/DOC/Chinese MYWorld Ballot - A4.doc"><img src="images/doc.jpg">  MY World Ballot - A4</a><br>
							<a href="media/chinese/DOC/Chinese MYWorld Ballot - Fold in half.doc"><img src="images/doc.jpg">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/chinese/DOC/Chinese MYWorld Ballot - Postcard.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>
							<a href="media/chinese/DOC/Chinese MYWorld Ballot - Priorities Supporting Information.doc"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table></div>
					<div id="korean">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/korean/AI/KOR_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/korean/AI/KOR_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/korean/AI/KOR_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/korean/AI/KOR_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br></td><td>
							<h2>PDF Files</h2>
							<a href="media/korean/PDF/KOR_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/korean/PDF/KOR_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/korean/PDF/KOR_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/korean/PDF/KOR_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br><br></td></tr></table></div>
					<div id="portugese">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/portugese/AI/POR_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/portugese/AI/POR_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/portugese/AI/POR_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/portugese/AI/POR_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br><br></td><td>
							<h2>PDF Files</h2>
							<a href="media/portugese/PDF/POR_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/portugese/PDF/POR_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/portugese/PDF/POR_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/portugese/PDF/POR_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information</a><br><br></td></tr></table></div>
					<div id="thai">
					<table style="width: 100%;"><tr><td>
							<h2>Illustrator Files</h2>
							<a href="media/thai/AI/THA_myworld_ballot_A4_twosided_2.ai"><img src="images/ai.png">  MY World Ballot - A4</a><br>
							<a href="media/thai/AI/THA_myworld_ballot_A4_foldinhalf_2.ai"><img src="images/ai.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/thai/AI/THA_Paper_Ballot_pledge_edits_2.ai"><img src="images/ai.png">  MY World Ballot - Postcard</a><br>
							<a href="media/thai/AI/THA_myworld_priorities_info.ai"><img src="images/ai.png">  MY World Ballot - Priorities Supporting Information</a><br><br>
							<h2>PDF Files</h2>
							<a href="media/thai/PDF/THA_myworld_ballot_A4_twosided_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4</a><br>
							<a href="media/thai/PDF/THA_myworld_ballot_A4_foldinhalf_2.pdf"><img src="images/pdf.png">  MY World Ballot - A4 - Fold in Half</a><br>
							<a href="media/thai/PDF/THA_Paper_Ballot_pledge_edits_2.pdf"><img src="images/pdf.png">  MY World Ballot - Postcard</a><br>
							<a href="media/thai/PDF/THA_myworld_priorities_info.pdf"><img src="images/pdf.png">  MY World Ballot - Priorities Supporting Information<a><br></td><td>
							<h2>Word Files</h2>
							<a href="media/thai/DOC/THA_Paper_Ballot_pledge_edits_2_MSWORD_28-3.doc"><img src="images/doc.jpg">  MY World Ballot - Postcard</a><br>
							<a href="media/thai/DOC/My priorities_THAI-28-3.docx"><img src="images/doc.jpg">  MY World Ballot - Priorities Supporting Information</a>
							<br></td></tr></table></div>
				</div>	
		</div>	
		</div>		
	</div>
</body>
</html>
