<?php
// connect to a remote host at a given port
$connection = new MongoClient( "mongodb://dynamix:eituv7@ds043057.mongolab.com:43057" ); 
$db = $connection->myworld_master;
$collection = $db->votes;

$cursor = $collection->find();
foreach ( $cursor as $id => $value )
{
    echo "$id: ";
    var_dump( $value );
}
?>
