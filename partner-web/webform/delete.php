<?php
 //       error_reporting(E_ALL);
//ini_set('display_errors', '1');
require_once('config.php');         

$dbHost = "localhost";        //Location Of Database usually its localhost
    $dbUser = "myworld";            //Database User Name
    $dbPass = "eituv7";            //Database Password
    $dbDatabase = "myworld_paper_ballot";    //Database Name
    
    $db = mysql_connect($dbHost,$dbUser,$dbPass)or die("Error connecting to database.");
    //Connect to the databasse
    mysql_select_db($dbDatabase, $db)or die("Couldn't select the database.");
	
// Database connection                                   
$mysqli = mysqli_init();
$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
$mysqli->real_connect($config['db_host'],$config['db_user'],$config['db_password'],$config['db_name']); 
                      
// Get all parameters provided by the javascript
$id = $mysqli->real_escape_string(strip_tags($_POST['id']));
//echo $id;
$newid = str_replace("volunteers_", "", $id);
//echo $newid;

$sql = "SELECT `volunteer_id` FROM `volunteers` WHERE `idscouts`='$newid' LIMIT 1";
$result = mysql_query($sql);
while ($row = mysql_fetch_array($result)) {
		$partnerid = $row['volunteer_id'];	}

// This very generic. So this script can be used to update several tables.
$return=false;
if ( $stmt = $mysqli->prepare("DELETE from volunteers WHERE idscouts=".$newid."")) {
	//$stmt->bind_param("si",$newid);
	$return = $stmt->execute();
	$stmt->close();
	
}             
$mysqli->close();        

echo $partnerid;
//echo $return ? "ok" : "error";

      