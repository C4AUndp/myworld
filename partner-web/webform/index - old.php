<!DOCTYPE html>
<?php 
session_start();
session_destroy();
?>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Ballot Entry Form</title>
	
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
			<h1>Ballot Entry Form</h1>		
			<form action="verify.php" method="post">
<!--Scout ID-->			
				  <div class="label_index">MY World Partner ID</div>
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
			</form><br>			
			<h1 style="font-size: 10pt; font-weight:normal;"><span onclick="register();">Partner Registration</span> | <span style="font-size: 10pt; font-weight:normal;" onclick="forgotpassword();">Forgot Password?</span></h1>
			
	</div>
</body>
</html>