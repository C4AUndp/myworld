<?php
header('Access-Control-Allow-Origin: *');
// Ensure that the HTTP method is POST:
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { die('Cannot GET /vote'); }

// Set the test flag:
$DEBUGMODE = TRUE;

// Include helper functions:
require_once('vote.helpers.php');

$jsonStr = file_get_contents("php://input"); //read the HTTP body.
$data = json_decode($jsonStr, true);

if($_REQUEST['debug'] == 1) {
	print_r($data);
}
$errors = validateRequest($data);
if($errors !== false) {
	$result = array('success'=>0, 'errors'=>$errors);
	echo json_encode($result);
} else {
	$resultArray = submitVote($data);
	$result = array('success'=>1, '_id'=>$resultArray['_id']['$oid'], 'errors'=>null);
	echo json_encode($result);
}


function validateRequest($data=false) {
	if($data === false || !is_array($data)) { return false; }
	$errors = false;
	
	$dbHost = "localhost";        //Location Of Database usually its localhost
    $dbUser = "myworld";            //Database User Name
    $dbPass = "eituv7";            //Database Password
    $dbDatabase = "myworld_apps";    //Database Name
    $db = mysql_connect($dbHost,$dbUser,$dbPass)or die("Error connecting to database.");
    mysql_select_db($dbDatabase, $db)or die("Couldn't select the database.");
	$key = $data['key'];
    $sql = mysql_query("SELECT apptype FROM apps WHERE apikey='$key' LIMIT 1");
    $apparray = mysql_fetch_array($sql);
	//print_r ($apptype);
	//echo $apparray['apptype'];
	
	if(empty($data['key'])) {
		$errors[] = array('type' => 'Missing field', 'field'=>'key');
	} elseif(strlen($data['key']) != 24) {
		$errors[] = array('type' => 'Invalid key');
	} elseif(verifyPartnerDomain($data['key'], $apparray['apptype']) == false) {	
		$errors[] = array('type' => 'Domain mismatch');
	} elseif(verifyPartnerKey($data['key']) == false) {	
		$errors[] = array('type' => 'Invalid Key');
	}
	
	if(!is_array($data['votes'])) {
		$errors[] = array('type' => 'Missing field', 'field'=>'votes');
	}	
	
	/*
	if(count($data['votes']) != 6) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'votes');
	}
	*/
	
	$uniquearray = array_unique($data['votes']);
	$arraywithdupescount = count($uniquearray);
	$normalarraycount = count($data['votes']);
	
	if($arraywithdupescount != $normalarraycount) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'votes');
	}	
	
	foreach($data['votes'] as $vote) {
		if($vote < 1 || $vote > 16) { 
			$errors[] = array('type' => 'Invalid field', 'field'=>'votes'); 
			break; 
		}
	}
	
	foreach($data['votes'] as $voteKey=>$voteValue) {
		$data['votes'][$voteKey] = (int)$voteValue;
	}
	
	if(strlen($data['suggested']) > 500 || hasHTML($data['suggested']) == true) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'suggested');
	}
	
	if(strlen($data['reason']) > 1000 || hasHTML($data['reason']) == true) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'reason');
	}
	
	$data['gender'] = strtolower($data['gender']);
	if(empty($data['gender'])) {
		$errors[] = array('type' => 'Missing field', 'field'=>'gender');
	} elseif($data['gender'] != 1 && $data['gender'] != 2) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'gender');
	}
	
	if(empty($data['age'])) {
		$errors[] = array('type' => 'Missing field', 'field'=>'age');
	} elseif(!is_numeric($data['age']) || $data['age'] < 1 || $data['age'] > 140) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'age');
	}
	
	if(empty($data['country'])) {
		$errors[] = array('type' => 'Missing field', 'field'=>'country');
	} elseif($data['country'] < 1 || $data['country'] > 195) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'country');
	}
	
	if(empty($data['education'])) {
		$errors[] = array('type' => 'Missing field', 'field'=>'education');
	} elseif(!is_numeric($data['education']) || $data['education'] < 1 || $data['education'] > 4) {
		$errors[] = array('type' => 'Invalid field', 'field'=>'education');
	}
	
	return $errors;
}



function submitVote($data) {
	if($data === false || !is_array($data)) { return false; }
	//if($data['test']){
	//print_r($data);
	//}else{
		//$date1 = date_create();
		$date = date("Y-m-d")."T".date("H:i:s")."Z"; 
		$data['timestamp']['$date'] = $date;
		$data['choices'] = $data['votes'];
		unset($data['votes']);
		$data['sourceMethod'] = 'apps';
		$data['sourceDetail'] = $data['key'];
		$json = json_encode($data); // $row can be an associative array or usually even a class object
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
		if($data['test']) {
			curl_setopt($ch, CURLOPT_URL, 'https://api.mongolab.com/api/1/databases/myworld_apps2/collections/test?apiKey=5084b374e4b059e606c9fef5');
		} else {
			curl_setopt($ch, CURLOPT_URL, 'https://api.mongolab.com/api/1/databases/myworld_apps2/collections/votes?apiKey=5084b374e4b059e606c9fef5');
		}
		
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
		curl_setopt($ch, CURLOPT_SSLVERSION, 3);
		curl_setopt($ch, CURLOPT_VERBOSE, 0);
		curl_setopt($ch, CURLOPT_HEADER, 0); // 1 to debug
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		ob_start();      // prevent any output
		$result = curl_exec ($ch); // execute the curl command
		ob_end_clean();  // stop preventing output
		curl_close($ch);
		unset($ch);
		
		$result = json_decode($result, true);
		return $result;
		
		
}

?>
