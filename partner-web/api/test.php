<?php
		$postData['key'] = 'JZEbrRkO02qZTXcr1Py2erMF';
		$postData['partner'] = 'DYNAMIX1';
		$postData['country'] = 193;
		$postData['region'] = 'New York';
		$postData['gender'] = 1;
		$postData['suggested_priority'] = 'test suggested priority';
		$postData['education'] = 1;
		$postData['age'] = 25;
		$postData['votes'] = array(1,2,12,4,5,6);
		$postData['test'] = 1;
		
		$json = json_encode($postData); // $row can be an associative array or usually even a class object
		echo post('http://myworldapps.seedmediagroup.com/vote.php?debug=1',$json);		
		
function post($url, $fields, &$curlinfo, $referer = null, $followlocation=true) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50215)");
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
	curl_setopt($ch, CURLOPT_SSLVERSION, 3);

	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
	curl_setopt($ch, CURLOPT_VERBOSE, 0);
	curl_setopt($ch, CURLOPT_HEADER, 0); // 1 to debug
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, $followlocation);

	curl_setopt($ch, CURLOPT_DNS_USE_GLOBAL_CACHE, FALSE);
	
	// uncomment the following 2 lines if you need to use a cookie jar file
	//curl_setopt($ch, CURLOPT_COOKIEJAR, "cookies.txt");
	//curl_setopt($ch, CURLOPT_COOKIEFILE, "cookies.txt");

	// misc. other options -- unused as of now
	//curl_setopt($ch, CURLOPT_FORBID_REUSE, TRUE);
	//curl_setopt($ch, CURLOPT_FRESH_CONNECT, TRUE);
	//curl_setopt($ch, CURLOPT_TIMEOUT, 0);
	//curl_setopt($ch, CURLOPT_FAILONERROR, 1);

	if($referer != null) {
		curl_setopt($ch, CURLOPT_REFERER, $referer);
	}
	ob_start();      // prevent any output
	$result = curl_exec ($ch); // execute the curl command
	ob_end_clean();  // stop preventing output

	/*
	// debugging information:
	echo "<pre>";
	echo strip_tags(print_r(curl_getinfo($ch)));
	echo "Result: \n" . htmlspecialchars($result);
	echo "</pre>";
	*/
	$curlinfo = curl_getinfo($ch);
	if(curl_errno($ch) != 0) {
		//echo '<br><br><b>ERROR: ' . curl_error($ch) . '('. curl_errno($ch) . ')</b><br><br>'; flush();
	}
	
	// close the curl connection gracefully
	curl_close($ch);
	
	// memory management:
	unset($ch);
	
	// return the result
	return $result;
}
?>