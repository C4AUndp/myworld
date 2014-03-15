<!DOCTYPE html>
<?php 
session_start();
session_destroy();
?>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>MyWorld Partner System</title>
	
	<link rel="stylesheet" type="text/css" href="reset.css">
	<link rel="stylesheet" type="text/css" href="style.css">
	<script>
	function moveOnMax(field,nextFieldID){
		if(field.value.length >= field.maxLength){
			document.getElementById(nextFieldID).focus();
		}
	}
	function forgotpassword(){
		t=prompt("Please enter your MY World Partner ID or e-mail address to recover your password.", "");
		if ( (t==' ') || (t==null) ) {
			/*alert("Invalid MY World Partner ID or e-mail address.");*/
		}else{
		alert("Your password has been e-mailed to the address provided during registration.");
		}
		
	}
	function register(){
		s=prompt("Please enter the MY World Partner registration password.", "");
		//alert(s);
		if(s=="12345"){
			window.location = 'register.php';
		}else if ( (s==' ') || (s==null) ){
		
		}else {
		alert("Invalid registration password.");}
	}
	</script>
</head>
<body>
	<div id="wrapper_index">	
<!--Logo-->					
		<a href="index.php"><img src="images/logo.png" width="150" alt="logo"></a>
			<h1>Partner System</h1>
					
			<form action="verify.php" method="post" style="float: right; position: relative; top: -110px; right: 0px;">
<!--Scout ID-->			
				  <div class="label_index">MyWorld Partner ID</div>
				  	<br>
					  <!--<input id="s1" name="s1" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s2')">
					  <input id="s2" name="s2" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s3')">
					  <input id="s3" name="s3" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s4')">
					  <input id="s4" name="s4" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s5')">
					  <input id="s5" name="s5" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s6')">
					  <input id="s6" name="s6" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s7')">
					  <input id="s7" name="s7" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'s8')">
					  <input id="s8" name="s8" type="text" size="1" maxlength="1" onkeyup="moveOnMax(this,'p1')">-->
					  <input id="s" name="s" type="text" size="8" maxlength="8" onkeyup="moveOnMax(this,'p1')">
					<br>
<!--Password-->					  
				  <div class="label_index">Password</div><br>
				 	  <input name="p1" id="p1" type="password"><br>
					  <input class="btn_index" style="cursor:pointer;" name="submit" type="submit" value="Login"></button>
					  <span style="font-size: 8pt; font-weight:normal; color:#999999;" onclick="forgotpassword();">Forgot Password?</span>
			</form>		
			
			<p style="color: #5E5E5E; font-size: 10pt; font-style: normal; line-height: 20px; width: 600px; white-space: nowrap;">Welcome to the MyWorld Partners Site<br><br>
This site has been designed to facilitate your organization's engagement in the MY World survey by<br> giving you access to information guides, communications material and the option to register as an<br> outreach partner of MY World.<br><br>
Your support is critical in reaching out directly into communities and drawing the digitally<br> disconnected, illiterate and poorest communities into the global debate.<br><br>

<b>Register your organization as an outreach partner of MY World for access to:</b><br><br>

-	A unique partner identification code which will allow you to track the MY World survey votes delivered<br>&nbsp;&nbsp;by your organization/network<br>
-	Printable MY World offline ballot cards and other communications material<br>
-	A central database to directly submit the MY World results collected offline<br>
-	A formatted spreadsheet to collect MY World offline survey results<br><br>

<!--All partner materials can be accessed here: <a href='downloads.php'>Downloads</a>.<br><br>-->


We look forward to joining forces with you to engage citizens around the world in the post-2015 debate!<br><br>
<a href="register.php" style="font-weight:bold;"><input class="btn_index" style="cursor:pointer;" name="submit" type="submit" value="Submit Registration Request"></button></a>	<span style="margin-left: 275px;"><style>a:link{color:#222222;} a:visited{color:#222222;} a:hover{color:#999999;}</style><a href='howto.php' style="font-weight: bold;">HOW TO GUIDES</a></span></p>
	</div>
</body>
</html>