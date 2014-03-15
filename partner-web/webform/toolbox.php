<?php
	
	
//require_once("connect.php");
function perform_query($sql, $dieonerror=true) {
	$mysql_username 		= 'myworld';
	$mysql_password	 		= 'eituv7';
	$mysql_database			= 'myworld_paper_ballot';
	$mysql_server 			= 'localhost';
	$dblink = mysql_connect($mysql_server, $mysql_username, $mysql_password);
	if (!$dblink) {
	    die('Website is currently unavailable due to planned maintenance');
	}
	mysql_select_db($mysql_database, $dblink);
	$result = mysql_query($sql);
	$error = mysql_error();
	$errorNumber = mysql_errno();
	if($error != null) {
		$out .= '
		<div class="alert">
		<B>MySQL Error</B> ('.$errorNumber.')<BR>
		'.$error.'<br>
		<br>
		<B>SQL Query</B>'.$sql.'
		</div>';
		echo "Query Error".$out;
		flush();
		if($dieonerror==true) {
			die;
		} else {
			return;
		}
	}
	return $result;
}
?>
