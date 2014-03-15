<?php     
   error_reporting(E_ALL);
ini_set('display_errors', '1');
    
require_once('config.php');      
require_once('EditableGrid.php');            


function fetch_pairs($mysqli,$query){
	if (!($res = $mysqli->query($query)))return FALSE;
	$rows = array();
	while ($row = $res->fetch_assoc()) {
		$first = true;
		$key = $value = null;
		foreach ($row as $val) {
			if ($first) { $key = $val; $first = false; }
			else { $value = $val; break; } 
		}
		$rows[$key] = $value;
	}
	return $rows;
}


// Database connection
$mysqli = mysqli_init();
$mysqli->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
$mysqli->real_connect($config['db_host'],$config['db_user'],$config['db_password'],$config['db_name']); 
                    
// create a new EditableGrid object
$grid = new EditableGrid();

/* 
*  Add columns. The first argument of addColumn is the name of the field in the databse. 
*  The second argument is the label that will be displayed in the header
*/
$grid->addColumn('volunteer_id', 'Partner ID', 'string'); 
$grid->addColumn('password', 'Password', 'string');  
$grid->addColumn('first_name', 'First Name', 'string');  
$grid->addColumn('last_name', 'Last Name', 'string');  
$grid->addColumn('organization', 'Organization', 'string');  
/* The column id_country and id_continent will show a list of all available countries and continents. So, we select all rows from the tables 
$grid->addColumn('id_continent', 'Continent', 'string' , fetch_pairs($mysqli,'SELECT id, name FROM continent'),true);  
$grid->addColumn('id_country', 'Country', 'string', fetch_pairs($mysqli,'SELECT id, name FROM country'),true );  */
$grid->addColumn('email', 'Email', 'email');
$grid->addColumn('url', 'URL', 'url');                                                
$grid->addColumn('country_code', 'Country Code', 'string');  
$grid->addColumn('phone_number', 'Phone Number', 'string');  
//$grid->addColumn('country', 'Country', 'string');  
//$grid->addColumn('state', 'State', 'string');
$grid->addColumn("actions", "Actions", "html", NULL, false);                                                                    
$result = $mysqli->query('SELECT * FROM volunteers');
$mysqli->close();

// send data to the browser
$grid->renderXML($result);

