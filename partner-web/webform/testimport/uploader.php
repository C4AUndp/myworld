<?php
if (($_FILES["file"]["size"] < 20000000))
  {
  if ($_FILES["file"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["file"]["error"] . "<br />";
    }
  if (pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION) != "csv")
	{
    echo "Invalid file: Please upload a valid CSV file and try again.<br />";
    }
  else
    {
	exec('rm -fv /var/www/html/webform/upload/DATA.csv', $out1);
	echo '<b>Uploading Ballot Data CSV file....</b></u><br><br>';
	echo '<b>Upload successful, analyzing file....</b></u><br><br>';
	//print_r ($out1);
		
    echo "File: " . $_FILES["file"]["name"] . "<br />";
	echo "Extension: " . pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION) . "<br />";
    echo "Type: " . $_FILES["file"]["type"] . "<br />";
    echo "Size: " . ($_FILES["file"]["size"] / 1024) . " Kb<br />";
    echo "Temp file: " . $_FILES["file"]["tmp_name"] . "<br />";

    if (file_exists("/var/www/html/webform/upload/DATA.csv"))
      {
      echo $_FILES["file"]["name"] . " already exists. ";
      }
    else
      {
      move_uploaded_file($_FILES["file"]["tmp_name"],
      "/var/www/html/webform/upload/DATA.csv");
      echo "Stored in: " . "upload/" . $_FILES["file"]["name"];
	   //echo '<br>Importing ballot data....';
	  echo '<br>Importing ballot data....';
	  	?>
        <script>
		//alert('Ballot Data CSV import complete.');
		window.location = "import.php"
		</script><?php	
	  
      }
    }
  }
else
  {
  echo "Invalid file";
  }
  
 
?>
