 <?php

if(isset($_POST['submit'])){
    $dbHost = "localhost";        //Location Of Database usually its localhost
    $dbUser = "myworld";            //Database User Name
    $dbPass = "eituv7";            //Database Password
    $dbDatabase = "myworld_paper_ballot";    //Database Name
    
    $db = mysql_connect($dbHost,$dbUser,$dbPass)or die("Error connecting to database.");
    //Connect to the databasse
    mysql_select_db($dbDatabase, $db)or die("Couldn't select the database.");
    //Selects the database
    
    /*
    The Above code can be in a different file, then you can place include'filename.php'; instead.
    */
    
    //Lets search the databse for the user name and password
    //Choose some sort of password encryption, I choose sha256
    //Password function (Not In all versions of MySQL).
    /*$usr1 = mysql_real_escape_string($_POST['s1']);
	$usr2 = mysql_real_escape_string($_POST['s2']);
	$usr3 = mysql_real_escape_string($_POST['s3']);
	$usr4 = mysql_real_escape_string($_POST['s4']);
	$usr5 = mysql_real_escape_string($_POST['s5']);
	$usr6 = mysql_real_escape_string($_POST['s6']);
	$usr7 = mysql_real_escape_string($_POST['s7']);
	$usr8 = mysql_real_escape_string($_POST['s8']);
	$usr = $usr1.$usr2.$usr3.$usr4.$usr5.$usr6.$usr7.$usr8;*/
	$usr = mysql_real_escape_string($_POST['s']);
	//echo $usr;
	//echo "<br>";
    $pas = mysql_real_escape_string($_POST['p1']);
	//echo $pas;
	//$pas = hash('sha256', mysql_real_escape_string($_POST['p1']));
    $sql = mysql_query("SELECT * FROM volunteers 
        WHERE volunteer_id='$usr' AND
        password='$pas'
        LIMIT 1");
    if(mysql_num_rows($sql) == 1 && $usr != "" && $pas != "" && $user != " " && $pas != " "){
        $row = mysql_fetch_array($sql);
        session_start();
        $_SESSION['scoutid'] = $row['volunteer_id'];
		/*$_SESSION['s1'] = $usr1;
		$_SESSION['s2'] = $usr2;
		$_SESSION['s3'] = $usr3;
		$_SESSION['s4'] = $usr4;
		$_SESSION['s5'] = $usr5;
		$_SESSION['s6'] = $usr6;
		$_SESSION['s7'] = $usr7;
		$_SESSION['s8'] = $usr8;*/
		$_SESSION['s'] = $usr;
        $_SESSION['fname'] = $row['first_name'];
        $_SESSION['lname'] = $row['last_name'];
		$_SESSION['admin'] = $row['admin'];
        $_SESSION['logged'] = TRUE;
		
		if($_SESSION['admin'] == '1'){
			echo $_SESSION['admin'];
			header("Location: volunteers.php");
			exit;
		}else{
			echo $_SESSION['admin'];
			header("Location: media.php");
			exit;
		}        
    }else{
		 ?><script>alert('Login failed: Invalid Volunteer ID and/or password.'); window.location = 'index.php'</script><?php // Modify to go to the page you would like
    }
}else{    //If the form button wasn't submitted go to the index page, or login page
?><script>alert('Login failed: Bad Volunteer ID and/or password.'); window.location = 'index.php'</script><?php
    exit;
}
?> 
