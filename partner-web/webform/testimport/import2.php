<?php
ini_set('memory_limit', '64M');
require_once('../toolbox.php');
include('../arrays.php');
//ini_set('display_errors',1);
//error_reporting(E_ALL);

$filename ="/var/www/html/webform/upload/DATA.csv";
$ballotsinserted = 0;
$errors = 0;
$row = 0;

function write($countrylist, $genderlist, $educationlist, $prioritylist, $monthlist, $partnerID, $country, $region_state, $day, $month, $year, $voter_gender, $voter_year_of_birth, $education_level, $priority1, $priority2, $priority3, $priority4, $priority5, $priority6, $suggested_priority) {

$choices = $priority1. ', ' .$priority2. ', ' .$priority3. ', ' .$priority4. ', ' .$priority5. ', ' .$priority6;

if(!isset($countrylist[strtolower($country)]))	{	
			$postData['errors']['partner'] = $partnerID;
	}
	if(!isset($genderlist[strtolower(rtrim($voter_gender))]))	{
			$postData['errors']['gender'] = $voter_gender;
	}
	if(($voter_year_of_birth >= 2016 || $voter_year_of_birth <= 1871) && ($voter_year_of_birth <= 1 || $voter_year_of_birth >= 151))	{
			$postData['errors']['age'] = $voter_year_of_birth;
	}
	if($day >= 32 || $day <= 0)	{
	
	}
	if($month >= 13 || $month <= 0)	{
		
	}
	if($year >= 2016 || $year <= 2011)	{
			
	}
	if(!isset($prioritylist[strtolower($priority1)]))	{
			$postData['errors']['priority1'] = $priority1;
	}
	if(!isset($prioritylist[strtolower($priority2)]))	{
			$postData['errors']['priority2'] = $priority2;
	}
	if(!isset($prioritylist[strtolower($priority3)]))	{
		$postData['errors']['priority3'] = $priority3;
	}
	if(!isset($prioritylist[strtolower($priority4)]))	{
			$postData['errors']['priority4'] = $priority4;
	}
	if(!isset($prioritylist[strtolower($priority5)]))	{
			$postData['errors']['priority5'] = $priority5;
	}
	if(!isset($prioritylist[strtolower($priority6)]))	{
			$postData['errors']['priority6'] = $priority6;
	}
	if($priority1 == $priority2 || $priority1 == $priority3 || $priority1 == $priority4 || $priority1 == $priority5 || $priority1 == $priority6 || $priority2 == $priority3 || $priority2 == $priority4 || $priority2 == $priority5 || $priority2 == $priority6 || $priority3 == $priority4 || $priority3 == $priority5 || $priority3 == $priority6 || $priority4 == $priority5 || $priority4 == $priority6 || $priority5 == $priority6)	{
			$postData['errors']['choices'] = $choices;
	}


	
	//echo $choices;
	$date = date("Y-m-d")."T".date("H:i:s")."Z";
	perform_query("INSERT INTO myworld_paper_ballot.ballots (timestamp, partnerID, country, region_state, day, month, year, voter_gender, voter_year_of_birth, education_level, choices, suggested_priority) VALUES ('$date', '$partnerID','$country','$region_state','$day','$month','$year','$voter_gender','$voter_year_of_birth','$education_level','$choices','$suggested_priority')");
	
		$postData['timestamp']['$date'] = $date;
		$postData['partner'] = $partnerID;
		$postData['country'] = (int)$countrylist[strtolower($country)];
		$postData['region'] = $region_state;
		$postData['gender'] = (int)$genderlist[strtolower($voter_gender)];
		$postData['suggested_priority'] = $suggested_priority;
		$edutemp = $educationlist[strtolower($education_level)];
		if ($edutemp >= 1 && $edutemp <= 4)	{
			$postData['education'] = (int)$edutemp; }
			else { $postData['education'] = ""; }
			
		if($voter_year_of_birth <= 2016 && $voter_year_of_birth >= 1870)	{
			$postData['age'] = (int)( (date("Y")) - ($voter_year_of_birth) ); }
			else { $postData['age'] = (int)$voter_year_of_birth; }
		
		$postData['sourceMethod'] = 'offline';
		$postData['sourceDetail'] = 'csvimport';
		$postData['choices'] = array((int)$prioritylist[$priority1], (int)$prioritylist[$priority2], (int)$prioritylist[$priority3], (int)$prioritylist[$priority4], (int)$prioritylist[$priority5], (int)$prioritylist[$priority6]);
		//$postData['timestamp'] = array('$date' => $date);
		
		$json = json_encode($postData); // $row can be an associative array or usually even a class object
		$ch = curl_init();
		
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
		curl_setopt($ch, CURLOPT_URL, 'https://api.mongolab.com/api/1/databases/myworld_manual2/collections/test?apiKey=5084b374e4b059e606c9fef5');
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
		ob_start(); // prevent any output		
		$result = curl_exec($ch);
		curl_close($ch); 
		ob_end_clean();
	//$testquery = "perform_query(\"INSERT INTO ballots (timestamp, partnerID, country, region_state, day, month, year, voter_gender, voter_year_of_birth, education_level, choices, suggested_priority) VALUES ('$date', '$partnerID','$country','$region_state','$day','$month','$year','$voter_gender','$voter_year_of_birth','$education_level','$choices','$suggested_priority')\")";
	//echo $testquery;
	//echo $partnerID.','.$country.','.$region_state.','.$day.','.$month.','.$year.','.$voter_gender.','.$voter_year_of_birth.','.$education_level.','.$choices.','.$suggested_priority;
}


ini_set("auto_detect_line_endings", 1);
$data = file_get_contents($filename);
//echo "filename: $filename\n<br>";
//echo "file_get_contents: ".print_r($data,true)."\n---------------------------\n<br>";
if (!function_exists('str_getcsv')) {
    function str_getcsv($input, $delimiter = ",", $enclosure = '"', $escape = "\\") {
        $fiveMBs = 5 * 1024 * 1024;
        $fp = fopen("php://temp/maxmemory:$fiveMBs", 'r+');
        fputs($fp, $input);
        rewind($fp);

        $data = fgetcsv($fp, 1000, $delimiter, $enclosure); //  $escape only got added in 5.3.0

        fclose($fp);
        return $data;
    }
}

$fields = array("partnerID","country","region_state","day","month","year","voter_gender","voter_year_of_birth","education_level","priority1","priority2","priority3","priority4","priority5","priority6","suggested_priority");

$csvlines = file($filename);//explode("\n", $data);
//echo "csvlines: ".print_r($csvlines,true)."\n---------------------------\n<br><br>";
foreach($csvlines as $k=>$line) {
	//echo "csvlines loop $k => $line \n<br><br>";
	$out[] = str_getcsv($line,",",'"',"\\");
}


foreach($out as $lineNumber=>$fieldarray) {
	if($lineNumber == 0) { continue; }
	foreach($fieldarray as $fieldNum => $val) {
		if($fieldNum >= 16) { continue; }
			//$val = mysql_real_escape_string($val);
			//echo "csvlines loop $fieldNum => $val \n<br><br>";
			$out2[$lineNumber][$fields[$fieldNum]] = $val;
	}
}

$out = $out2;



	foreach($out as $k=>$v) {
	if($k == 0) { continue; }
      //echo 'check('.$v[0].', '.$v[1].', '.$v[2].')'."\n";
	  if ($v['country'] != '') { 
      write($countrylist, $genderlist, $educationlist, $prioritylist, $monthlist, $v['partnerID'], $v['country'], $v['region_state'], $v['day'], $v['month'], $v['year'], $v['voter_gender'], $v['voter_year_of_birth'], $v['education_level'], $v['priority1'], $v['priority2'], $v['priority3'], $v['priority4'], $v['priority5'], $v['priority6'], $v['suggested_priority']); 
	  $ballotsinserted++; 
	  }	  	}
		echo ('<br>Ballot import successful: '.$ballotsinserted.' ballots inserted into database.<br><br><a href="upload2.php">Back</a>'); 
		
//mysql_close();
?>
