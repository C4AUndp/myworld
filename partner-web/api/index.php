<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
require_once "/usr/share/pear/Mail.php";

function genAPI($length='24', $charset='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
{
    $str = '';
    $count = strlen($charset);
    while ($length--) {
        $str .= $charset[mt_rand(0, $count-1)];
    }
    return $str;
}
//session_start();
//if(!$_SESSION['logged']){
 //   header("Location: index.php");
 //  exit;
//} 

if(isset($_POST['submit'])){



	$apikey = genAPI();
    # connect to the database here
	$dbHost = "localhost";        //Location Of Database usually its localhost
    $dbUser = "myworld";            //Database User Name
    $dbPass = "eituv7";            //Database Password
    $dbDatabase = "myworld_apps";    //Database Name
    
    $db = mysql_connect($dbHost,$dbUser,$dbPass)or die("Error connecting to database.");
    //Connect to the databasse
    mysql_select_db($dbDatabase, $db)or die("Couldn't select the database.");
    # search the database to see if the app name has been taken or not
	$appname = mysql_real_escape_string($_POST['appname']);
    $sql = mysql_query("SELECT * FROM apps WHERE appname='$appname' LIMIT 1");
    $row = mysql_fetch_array($sql);
    #check too see what fields have been left empty, and if the passwords match
    if(empty($_POST['organization']) || empty($_POST['name']) || empty($_POST['country']) || empty($_POST['appname']) || empty($_POST['apptype']) || empty($_POST['email']) || empty($_POST['email2'])|| ($_POST['email'] != $_POST['email2']) || (empty($_POST['domain']) && $_POST['apptype'] == '1')){
	
        # if a field is empty, or the passwords don't match make a message
        $error = '<p style="color: red !important;">';
		if(empty($_POST['organization'])){
            $error .= 'Organization can\'t be empty<br>';
        }
		if(empty($_POST['name'])){
            $error .= 'Name can\'t be empty<br>';
        }
		if(empty($_POST['country']) || $_POST['apptype'] == '0'){
            $error .= 'Please select a country.<br>';
        }
		if(empty($_POST['appname'])){
            $error .= 'Application Name can\'t be empty<br>';
        }
		if($_POST['apptype'] == '0'){
            $error .= 'Please select an app type.<br>';
        }
		if(empty($_POST['domain']) && $_POST['apptype'] != '2'){
            $error .= 'Domain can\'t be empty<br>';
        }
        if(empty($_POST['email'])){
            $error .= 'Email can\'t be empty<br>';
        }
		if(empty($_POST['email2'])){
            $error .= 'Email confirmation can\'t be empty<br>';
        }
		if($_POST['email'] != $_POST['email2']){
            $error .= 'Email addresses do not match<br>';
        }
        $error .= '</p>';
    }else{
        # If all fields are not empty, and the passwords match,
        # create a session, and session variables,
        $query = sprintf("INSERT INTO apps(`organization`,`name`,`email`,`country`,`partnerID`,`appname`,`apptype`,`apikey`,`domain`)
            VALUES('%s','%s','%s','%s','%s','$appname','%s','$apikey','%s')",
            mysql_real_escape_string($_POST['organization']),
            mysql_real_escape_string($_POST['name']),
            mysql_real_escape_string($_POST['email']),
            mysql_real_escape_string($_POST['country']),
			mysql_real_escape_string($_POST['partnerID']),
			mysql_real_escape_string($_POST['apptype']),
			mysql_real_escape_string($_POST['domain']))or die(mysql_error());
			//echo $query;
        $sql = mysql_query($query);
        # Redirect the user to a login page
        //header("Location: admin.php");
	
		// Name of sender
		//$name=$_POST['fname']. ' ' .$_POST['lname'];
		$organization=$_POST['organization'];
		$name=$_POST['name'];
		$email=$_POST['email'];
		$apptype=$_POST['apptype'];
		$domain=$_POST['domain'];

		 $from = "MY World Application System <support@myworld2015.org>";
		 $to = "$name <$email>";
		 //$to = "thomas@dynamixconsulting.net";
		 //$to = "support@myworld2015.org";
		 $subject="MY World Apps - MY World Application API Request";
		 $body="<span style='font-size: 14px;'>
			$name,<br><br>
			A MY World application API request has been received.  Your API key is listed below:<br>
			<br>
			API Key Request Information:<br>
			<br>
			<b>Organization: $organization<br>
			Contact Name: $name<br>
			Email Address: $email<br><br>
			Application name: $appname<br><br>
			API Key: $apikey</b><br>
			<br>
			MY World Application System<br><br>
			</span>";

		 
		 $host = "ssl://bromo.thinkfixed.com";
		 $port = "465";
		 $username = "myworld@seedmediagroup.com";
		 $password = "eituv7";
		 $contenttype = "text/html; charset=iso-8859-1"; 
		 $mimeversion = "1.0"; 
		 $headers = array ('From' => $from,
		   'To' => $to,
		   'Subject' => $subject,
		   'Content-type' => $contenttype,
		   'MIME-version' => $mimeversion);
		 $smtp = Mail::factory('smtp',
		   array ('host' => $host,
			 'port' => $port,
			 'auth' => true,
			 'username' => $username,
			 'password' => $password));
		 
		 $mail = $smtp->send($to, $headers, $body);
		 
		 if (PEAR::isError($mail)) {
		   echo("<p>" . $mail->getMessage() . "</p>");
		  } else {
		   //echo("<p>Message successfully sent!</p>");
		  }

		// Check, if message sent to your email
		// display message "We've recived your information"
		?>
		<script>alert ('Thank you for registering!  You will receive an email with your API key shortly.'); window.location = 'index.php'</script><?php
		//header("Location: admin.php");
        exit;
    }
}
# echo out each variable that was set from above,
# then destroy the variable.

?>
<!-- Start your HTML/CSS/JavaScript here -->

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>MY World Application System - API Request Form</title>
	
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

	
<script>
function genAPI() {
 var chars = "abcdefghiklmnopqrstuvwxyz1234567890";
        var string_length = 86;
        var randomstring = '';
        for (var i=0; i<string_length; i++) {
            var rnum = Math.floor(Math.random() * chars.length);
            randomstring += chars.substring(rnum,rnum+1);
        }
		$('#s').attr("value", randomstring);
}
</script>
	
</head>
<body>
	<div id="wrapper">
		
			<a href="index.php"><img src="images/logo.png" width="150" alt="logo"></a>
<!--Display Username Associated with ID-->
			<h1>Application System</h1>
		
<h1 class="pageTitle">MY World Voting API</h1>

<div id="admin" style="float:right; margin: 0 0 30px 50px;">
<!--Scout ID 8 digit letters and numbers-->
			<div id="scout_admin">
			<h2>Application API Request Form</h2>
			<p style="color: #5E5E5E; font-size: 10pt; font-style: normal; margin: 0 0 30px;">Welcome to the MY World Application system!<br><br>
Please request a MY World Application API below. Once your account request is received and processed, you will receive an e-mail with your API key.<br><br>
Fields marked with a * are required.  Fields marked with a ** are required ONLY for web based applications.</p>
 <div class="border"></div>
				<form action="index.php" method="post">				
				<div class="name_admin">
				<h3>Contact information:</h3>
						
						
						<div class="admin_form" style="clear:left;"> Organization*</div>
					  <input name="organization" id="organization" type="text" size="100" maxlength="100">
					  
					  <div class="admin_form" style="clear:left;"> Contact Name*</div>
					  <input name="name" id="name" type="text" size="100" maxlength="100">
					  
					<div class="admin_form" style="clear:both;"> E-mail*</div>
					  <input name="email" id="email" type="text" size="100" maxlength="100">
					  
				  <div class="admin_form" style="clear:both;"> Confirm E-mail*</div>
					  <input name="email2" id="email2" type="text" size="100" maxlength="100">
				
					<p>MY World Application API keys are sent to the provided e-mail </p>
				
				<div class="admin_select">Country*</div>
					<select name="country" id="country" class="select_admin">
					  <option selected="selected" value="Country">Country</option><option value="1">Afghanistan</option><option value="2">Albania</option><option value="3">Algeria</option><option value="4">Andorra</option><option value="5">Angola</option><option value="6">Antigua and Barbuda</option><option value="7">Argentina</option><option value="8">Armenia</option><option value="9">Australia</option><option value="10">Austria</option><option value="11">Azerbaijan</option><option value="12">Bahamas</option><option value="13">Bahrain</option><option value="14">Bangladesh</option><option value="15">Barbados</option><option value="16">Belarus</option><option value="17">Belgium</option><option value="18">Belize</option><option value="19">Benin</option><option value="20">Bhutan</option><option value="21">Bolivia (Plurinational State of)</option><option value="22">Bosnia and Herzegovina</option><option value="23">Botswana</option><option value="24">Brazil</option><option value="25">Brunei Darussalam</option><option value="26">Bulgaria</option><option value="27">Burkina Faso</option><option value="28">Burundi</option><option value="29">Cambodia</option><option value="30">Cameroon</option><option value="31">Canada</option><option value="32">Cape Verde</option><option value="33">Central African Republic</option><option value="34">Chad</option><option value="35">Chile</option><option value="36">China</option><option value="37">Colombia</option><option value="38">Comoros</option><option value="39">Congo</option><option value="40">Costa Rica</option><option value="41">Cote d'Ivoire</option><option value="42">Croatia</option><option value="43">Cuba</option><option value="44">Cyprus</option><option value="45">Czech Republic</option><option value="46">Democratic People's Republic of Korea</option><option value="47">Democratic Republic of the Congo</option><option value="48">Denmark</option><option value="49">Djibouti</option><option value="50">Dominica</option><option value="51">Dominican Republic</option><option value="52">Ecuador</option><option value="53">Egypt</option><option value="54">El Salvador</option><option value="55">Equatorial Guinea</option><option value="56">Eritrea</option><option value="57">Estonia</option><option value="58">Ethiopia</option><option value="59">Fiji</option><option value="60">Finland</option><option value="61">France</option><option value="62">Gabon</option><option value="63">Gambia</option><option value="64">Georgia</option><option value="65">Germany</option><option value="66">Ghana</option><option value="67">Greece</option><option value="68">Grenada</option><option value="69">Guatemala</option><option value="70">Guinea</option><option value="71">Guinea-Bissau</option><option value="72">Guyana</option><option value="73">Haiti</option><option value="74">Honduras</option><option value="75">Hungary</option><option value="76">Iceland</option><option value="77">India</option><option value="78">Indonesia</option><option value="79">Iran (Islamic Republic of)</option><option value="80">Iraq</option><option value="81">Ireland</option><option value="82">Israel</option><option value="83">Italy</option><option value="84">Jamaica</option><option value="85">Japan</option><option value="86">Jordan</option><option value="87">Kazakhstan</option><option value="88">Kenya</option><option value="89">Kiribati</option><option value="90">Kuwait</option><option value="91">Kyrgyzstan</option><option value="92">Lao People's Democratic Republic</option><option value="93">Latvia</option><option value="94">Lebanon</option><option value="95">Lesotho</option><option value="96">Liberia</option><option value="97">Libya</option><option value="98">Liechtenstein</option><option value="99">Lithuania</option><option value="100">Luxembourg</option><option value="101">Madagascar</option><option value="102">Malawi</option><option value="103">Malaysia</option><option value="104">Maldives</option><option value="105">Mali</option><option value="106">Malta</option><option value="107">Marshall Islands</option><option value="108">Mauritania</option><option value="109">Mauritius</option><option value="110">Mexico</option><option value="111">Micronesia (Federated States of)</option><option value="112">Monaco</option><option value="113">Mongolia</option><option value="114">Montenegro</option><option value="115">Morocco</option><option value="116">Mozambique</option><option value="117">Myanmar</option><option value="118">Namibia</option><option value="119">Nauru</option><option value="120">Nepal</option><option value="121">Netherlands</option><option value="122">New Zealand</option><option value="123">Nicaragua</option><option value="124">Niger</option><option value="125">Nigeria</option><option value="126">Norway</option><option value="127">Oman</option><option value="128">Pakistan</option><option value="129">Palau</option><option value="130">Panama</option><option value="131">Papua New Guinea</option><option value="132">Paraguay</option><option value="133">Peru</option><option value="134">Philippines</option><option value="135">Poland</option><option value="136">Portugal</option><option value="137">Qatar</option><option value="138">Republic of Korea</option><option value="139">Republic of Moldova</option><option value="140">Romania</option><option value="141">Russian Federation</option><option value="142">Rwanda</option><option value="143">Saint Kitts and Nevis</option><option value="144">Saint Lucia</option><option value="145">Saint Vincent and the Grenadines</option><option value="146">Samoa</option><option value="147">San Marino</option><option value="148">Sao Tome and Principe</option><option value="149">Saudi Arabia</option><option value="150">Senegal</option><option value="151">Serbia</option><option value="152">Seychelles</option><option value="153">Sierra Leone</option><option value="154">Singapore</option><option value="155">Slovakia</option><option value="156">Slovenia</option><option value="157">Solomon Islands</option><option value="158">Somalia</option><option value="159">South Africa</option><option value="160">South Sudan</option><option value="161">Spain</option><option value="162">Sri Lanka</option><option value="163">Sudan</option><option value="164">Suriname</option><option value="165">Swaziland</option><option value="166">Sweden</option><option value="167">Switzerland</option><option value="168">Syrian Arab Republic</option><option value="169">Tajikistan</option><option value="170">Thailand</option><option value="171">The former Yugoslav Republic of Macedonia</option><option value="172">Timor-Leste</option><option value="173">Togo</option><option value="174">Tonga</option><option value="175">Trinidad and Tobago</option><option value="176">Tunisia</option><option value="177">Turkey</option><option value="178">Turkmenistan</option><option value="179">Tuvalu</option><option value="180">Uganda</option><option value="181">Ukraine</option><option value="182">United Arab Emirates</option><option value="183">United Kingdom of Great Britain and Northern Ireland</option><option value="184">United Republic of Tanzania</option><option value="185">United States of America</option><option value="186">Uruguay</option><option value="187">Uzbekistan</option><option value="188">Vanuatu</option><option value="189">Venezuela (Bolivarian Republic of)</option><option value="190">Viet Nam</option><option value="191">Yemen</option><option value="192">Zambia</option><option value="193">Zimbabwe</option>
					</select>
				
				<div class="admin_form" style="clear:left;"> Partner ID</div>
					  <input name="partnerID" id="partnerID" type="text" size="100" maxlength="100">
					  
					  <div class="border"></div>
				<h3>Application information:</h3>
					  
				<div class="admin_form" style="clear:left;"> Application Name*</div>
					  <input name="appname" id="appname" type="text" size="100" maxlength="100">
					  
				<div class="admin_select">Application Type*</div>
					<select name="apptype" id="apptype" class="select_admin">
					  <option selected="selected" value="1">Web</option><option value="2">Mobile</option></select>
				
				<div class="admin_form" style="clear:left;"> Domain** (required for Web applications)</div>
					  <input name="domain" id="domain" type="text" size="100" maxlength="100">				
					  <p align="right" style="margin-right: 40px;">Example: www.yourdomain.com</p>
				
</div>
	
		

				<div class="border"></div>
				
				<!--<h3>Location</h3>
				
				
				
				<div class="admin_select" style="padding-right:10px;">State/Region* </div>
					<input name="state" type="text" id="state" name="state" size="20" maxlength="150" style="margin: 0px 0px 20px 0px; width: 150px;">
					
				<p>Provide MY World Partner principal location</p>	-->


				
<!--Ballot entry-->
<!--Border-->
		<!--<div class="border"></div>-->

			

			
				<br><br>
				<input class="btn_index" style="float:left; margin:-25px 10px 0px 0px; cursor: pointer; " type="submit" name="submit" value="Submit API Request" /><br>
				
				<?php
				if(isset($error)){
						echo $error;
						unset($error);
					}
				?>
		</form>
				<br>
				
			
	</div></div>

	<div id="api-docs"><?php print file_get_contents('api.html');?></div>

</div>

</body>
</html>
