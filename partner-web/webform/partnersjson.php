<?php
/*
 * PHP code to export MySQL data to CSV
 * Sends the result of a MySQL query as a CSV file for download
 */

/*
 * establish database connection
 */

$conn = mysql_connect('localhost', 'myworld', 'eituv7') or die(mysql_error());
mysql_select_db('myworld_paper_ballot', $conn) or die(mysql_error($conn));

/*
 * execute sql query
 */

$query = sprintf('SELECT volunteer_id,organization,first_name FROM volunteers');
$result = mysql_query($query, $conn) or die(mysql_error($conn));



$arr = array();
    while ($row = mysql_fetch_assoc($result)) {
		$arr['partners'][] = $row; }

$json = json_encode($arr);

echo $json;
?>