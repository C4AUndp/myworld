<?PHP
$access_key = $_REQUEST['access_key'];

if ($access_key == "myworld2015") {
	header('Location: http://data.myworld2015.org/index2.html');
	exit;
} else {
	$key_message = "Please enter your access key";
}
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>My World Data</title>
</head>

<body>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr align="center">
    <td><h1>This page is down for maintenance. Please check back soon.<br />
    </h1></td>
  </tr>
  <tr>
    <td align="center">&nbsp;</td>
  </tr>
  <tr>
    <td align="center"><h4><?PHP echo $key_message; ?></h4></td>
  </tr>
  <tr>
    <td align="center"><form action="index.php" method="POST">
<input name="access_key" type="text" />
<input type="submit" name="button" id="button" value="Go" />
</form></td>
  </tr>
  <tr>
    <td>&nbsp;</td>
  </tr>
  <tr>
    <td>&nbsp;</td>
  </tr>
  <tr align="center">
    <td>For urgent enquiries email <a href="mailto:frances.simpsonallen@undp.org">frances.simpsonallen@undp.org</a></td>
  </tr>
</table>
</body>
</html>
