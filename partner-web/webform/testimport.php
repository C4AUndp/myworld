<?php
ini_set('memory_limit', '64M');
require_once('toolbox.php');
include('arrays.php');
//ini_set('display_errors',1);
//error_reporting(E_ALL);

$filename ="/www/seedmediagroup/httpdocs/clients/webform/upload/DATA.csv";
$ballotsinserted = 0;
$errors = 0;
$row = 0;

function write($countrylist, $genderlist, $educationlist, $prioritylist, $monthlist, $partnerID, $country, $region_state, $day, $month, $year, $voter_gender, $voter_year_of_birth, $education_level, $priority1, $priority2, $priority3, $priority4, $priority5, $priority6, $suggested_priority) {
	$choices = $priority1. ', ' .$priority2. ', ' .$priority3. ', ' .$priority4. ', ' .$priority5. ', ' .$priority6;
	//echo $choices;
	$date1 = date_create();
	$date = date_format($date1, 'U = Y-m-d H:i:s');
	perform_query("INSERT INTO myworld_paper_ballot.ballots (timestamp, partnerID, country, region_state, day, month, year, voter_gender, voter_year_of_birth, education_level, choices, suggested_priority) VALUES ('$date', '$partnerID','$country','$region_state','$day','$month','$year','$voter_gender','$voter_year_of_birth','$education_level','$choices','$suggested_priority')");
	
		$postData['partner'] = $partnerID;
		$postData['country'] = (int)$countrylist[strtolower($country)];
		$postData['region'] = $region_state;
		$postData['gender'] = (int)$genderlist[strtolower($voter_gender)];
		$postData['suggested_priority'] = $suggested_priority;
		$edutemp = $educationlist[strtolower($education_level)];
		if ($edutemp >= 1 && $edutemp <= 4)	{
			$postData['education'] = $edutemp; }
			else { $postData['education'] = ""; }
		$postData['age'] = (int)( (date("Y")) - ($voter_year_of_birth) );
		$postData['sourceMethod'] = 'offline';
		$postData['sourceDetail'] = 'csvimport';
		$postData['choices'] = array((int)$prioritylist[$priority1], (int)$prioritylist[$priority2], (int)$prioritylist[$priority3], (int)$prioritylist[$priority4], (int)$prioritylist[$priority5], (int)$prioritylist[$priority6]);
		//$postData['timestamp'] = array('$date' => $date);
		
		$json = json_encode($postData); // $row can be an associative array or usually even a class object
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json; charset=utf-8'));
		curl_setopt($ch, CURLOPT_URL, 'https://api.mongolab.com/api/1/databases/myworld_manual/collections/test?apiKey=5084b374e4b059e606c9fef5');
		curl_setopt($ch, CURLOPT_POST, true);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $json);

		curl_exec($ch);
		curl_close($ch); 
	//$testquery = "perform_query(\"INSERT INTO ballots (timestamp, partnerID, country, region_state, day, month, year, voter_gender, voter_year_of_birth, education_level, choices, suggested_priority) VALUES ('$date', '$partnerID','$country','$region_state','$day','$month','$year','$voter_gender','$voter_year_of_birth','$education_level','$choices','$suggested_priority')\")";
	//echo $testquery;
	//echo $partnerID.','.$country.','.$region_state.','.$day.','.$month.','.$year.','.$voter_gender.','.$voter_year_of_birth.','.$education_level.','.$choices.','.$suggested_priority;
}

function check($countrylist, $genderlist, $educationlist, $prioritylist, $monthlist, $line, $partnerID, $country, $region_state, $day, $month, $year, $voter_gender, $voter_year_of_birth, $education_level, $priority1, $priority2, $priority3, $priority4, $priority5, $priority6, $suggested_priority)
{
	$line++;
	//$query = perform_query("SELECT * FROM data WHERE data.country='$country' && data.year='$year' && data.variable='$variable'");
	//$query2 = perform_query("SELECT variable FROM vars WHERE vars.variable='$variable'");
	//$query3 = perform_query("SELECT country FROM countries WHERE countries.country='$country'");
	/*if($partnerID == '' || $partnerID == ' ')	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$partnerID.' is not a valid Partner ID.'."<br>");
			return TRUE;
	}*/				
	if($voter_year_of_birth >= 2016 || $voter_year_of_birth <= 1871)	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$voter_year_of_birth.' is not a valid year of birth.'."<br>");
			return TRUE;
	}
	//print_r($countrylist);
	if(!isset($countrylist[strtolower($country)]))	{	
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$country.' is not a valid country code.  Valid entries for this field are 1-193'."<br>");
			return TRUE;
	}
	if(!isset($genderlist[strtolower($voter_gender)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$voter_gender.' is not a valid gender code.  Valid entries for this field are 1 or 2 (male or female)'."<br>");
			return TRUE;
	}
	if($voter_year_of_birth >= 2016 || $voter_year_of_birth <= 1871)	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$voter_year_of_birth.' is not a valid year of birth.  Valid entries for this field are 1872-2015'."<br>");
			return TRUE;
	}
	if($day >= 32 || $day <= 0)	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$day.' is not a valid day.  Valid entries for this field are 1-31'."<br>");
			return TRUE;
	}
	if($month >= 13 || $month <= 0)	{
		if(!isset($monthlist[strtolower($month)])) {
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$month.' is not a valid month. Valid entries for this field are 1-12'."<br>");
			return TRUE; }
	}
	if($year >= 2016 || $year <= 2011)	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$year.' is not a valid year.  Valid entries for this field are 2012-2015'."<br>");
			return TRUE;
	}
	if(!isset($prioritylist[strtolower($priority1)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$priority1.' for Priority #1 is not valid.  Valid entries for this field are 100-115'."<br>");
			return TRUE;
	}
	if(!isset($prioritylist[strtolower($priority2)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$priority2.' for Priority #2 is not valid.  Valid entries for this field are 100-115'."<br>");
			return TRUE;
	}
	if(!isset($prioritylist[strtolower($priority3)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$priority3.' for Priority #3 is not valid.  Valid entries for this field are 100-115'."<br>");
			return TRUE;
	}
	if(!isset($prioritylist[strtolower($priority4)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$priority4.' for Priority #4 is not valid.  Valid entries for this field are 100-115'."<br>");
			return TRUE;
	}
	if(!isset($prioritylist[strtolower($priority5)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$priority5.' for Priority #5 is not valid.  Valid entries for this field are 100-115'."<br>");
			return TRUE;
	}
	if(!isset($prioritylist[strtolower($priority6)]))	{
			echo ('<br>ERROR: Line #'.$line.', VALUE: '.$priority6.' for Priority #6 is not valid.  Valid entries for this field are 100-115'."<br>");
			return TRUE;
	}
	if($priority1 == $priority2 || $priority1 == $priority3 || $priority1 == $priority4 || $priority1 == $priority5 || $priority1 == $priority6 || $priority2 == $priority3 || $priority2 == $priority4 || $priority2 == $priority5 || $priority2 == $priority6 || $priority3 == $priority4 || $priority3 == $priority5 || $priority3 == $priority6 || $priority4 == $priority5 || $priority4 == $priority6 || $priority5 == $priority6)	{
			echo ('<br>ERROR: Line #'.$line.', All six (6) priorities need to be unique.'."<br>");
			return TRUE;
	}	
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
		if ($v['country'] != '') { 
      //echo 'check('.$v[0].', '.$v[1].', '.$v[2].')'."\n";
      $nogood = check($countrylist, $genderlist, $educationlist, $prioritylist, $monthlist, $k, $v['partnerID'], $v['country'], $v['region_state'], $v['day'], $v['month'], $v['year'], $v['voter_gender'], $v['voter_year_of_birth'], $v['education_level'], $v['priority1'], $v['priority2'], $v['priority3'], $v['priority4'], $v['priority5'], $v['priority6'], $v['suggested_priority']);
		if ($nogood == TRUE) {	$errors++; }
	  } }

if($errors == 0){
	foreach($out as $k=>$v) {
	if($k == 0) { continue; }
      //echo 'check('.$v[0].', '.$v[1].', '.$v[2].')'."\n";
	  if ($v['country'] != '') { 
      write($countrylist, $genderlist, $educationlist, $prioritylist, $monthlist, $v['partnerID'], $v['country'], $v['region_state'], $v['day'], $v['month'], $v['year'], $v['voter_gender'], $v['voter_year_of_birth'], $v['education_level'], $v['priority1'], $v['priority2'], $v['priority3'], $v['priority4'], $v['priority5'], $v['priority6'], $v['suggested_priority']); 
	  $ballotsinserted++; 
	  }	  	}
	  if($errors == 0  && $ballotsinserted != 0){ echo ('<br>Ballot import successful: '.$ballotsinserted.' ballots inserted into database.<br><br><a href="upload2.php">Back</a>'); } 
	  if($ballotsinserted == 0){ echo ('<br>Ballot import failed: Please check the format of your CSV file and try again.<br><br><a href="upload2.php">Back</a>'); }
	  }
	  else { if($errors > 0){ echo ('<br>Ballot import failed, please correct the referenced errors and submit the file again.<br><br><a href="upload2.php">Back</a>'); }
}


//mysql_close();
?>