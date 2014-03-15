<?php

// time host path querystring response-status response-time bytes-sent
// "%t %h %U %q %X %D %B"

// $filepath = '/var/log/apache2/myworld.log';
$filepath = 'myworld.log';
$format = array(
	'time' => 0,
	'host' => 1,
	'path' => 2,
	'queryString' => 3, 
	'responseStatus' => 4, 
	'responseTime' => 5, 
	'bytesSent' => 6,
);


$handle = fopen($filepath, 'r');

if ($handle) {

	// get lines
	$lines = array();
	while (($buffer = fgets($handle, 4096)) !== false) {
		$lines[] = $buffer;
	}
	if (!feof($handle)) {
		echo "Error: unexpected fgets() fail\n";
	}
	fclose($handle);

	// parse data
	$data = array();
	while (count($lines) > 0) {
		$l = array_pop($lines);
		$l = explode(" | ", $l);
		if (count($l) == 7) {
			$row = array();
			foreach($format as $k => $i) {
				$row[$k] = trim($l[$i]);
			}
			$data[] = $row;
		}
	}

	print json_encode($data);

} else {

	print json_encode(array( 'error' => 'Unable to open log file.' ));
	
}

?>