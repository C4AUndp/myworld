<?php

// OFFLINE DB
// $mongo = new MongoClient('mongodb://analytics:plantyours1234@ds057197.mongolab.com:57197/myworld_manual2');
// $db = $mongo->myworld_manual2;
// $votes = $db->csv_votes;

// MASTER DB
$mongo = new MongoClient('mongodb://dynamix:84ndzah@ds049937.mongolab.com:49937/myworld_master2');
$db = $mongo->myworld_master2; 
$votes = $db->votes;

$aggregate = array(
	array( '$match' => array( 'data_quality' => array( '$ne' => -5 ), 'sourceNotes' => array( '$exists' => 1 ) ) ),
	array( '$group' => array( '_id' => '$sourceNotes', 'votes' => array( '$sum' => 1 ) ) ),
);

try {
	$results = $votes->aggregate($aggregate);
} catch (MongoCursorTimeoutException $e) {
	die ('Mongo connection timed out.');
}

$rows = $results['result'];
usort($rows, 'sortRows');

$headers = array(
	'Note' => array( 'col'=>'_id' ),
	'Votes' => array( 'col'=>'votes' ),
);

function sortRows($a, $b) {
	return strcmp($a['_id'], $b['_id']);
}

function formatTable($headers, $rows) {

	$ret = '';

	$ret .= '<table cellspacing="0" cellpadding="2" border="1">';
	
	$ret .= '<tr>';
	foreach($headers as $name => $info) {
		$ret .= "<th>$name</th>";
	}
	$ret .= '</tr>';

	foreach($rows as $row) {
		$ret .= '<tr>';
		foreach($headers as $name => $info) {
			$val = $row[$info['col']];
			$ret .= "<td>$val</td>";
		}
		$ret .= '</tr>';
	}

	$ret .= '</table>';

	return $ret;

}

?>

<h1>MY World Imported Votes Monitor</h1>
<h3>Showing totals of valid votes in the master database, by "Source Notes."</h3>

<?php

print formatTable($headers, $rows);

?>