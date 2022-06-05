<?php
	ob_start('ob_gzhandler');
	session_start();

	if (isset($_SESSION['level']) && isset($_GET['offnum']) && isset($_GET['ldt'])) {
		$pgofst = $_GET['offnum'];
		$udt = $_GET['ldt'];
    }
    else {
    	exit();
    }
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
		or die('Could not connect: ' . pg_last_error());
	
	if ($udt=='all') {
		$query = "SELECT eid as id, waktu as psd FROM earthquake_id ORDER BY waktu DESC LIMIT 10 OFFSET $1";
		$params = array($pgofst);
	}
	else {
		$query = "SELECT eid as id, waktu as psd FROM earthquake_id WHERE waktu::date=$1 ORDER BY waktu DESC LIMIT 10 OFFSET $2";
		$params = array($udt, $pgofst);
	}
	
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	$rows = array();
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		$rows[] = $line;
	}
	echo json_encode($rows);
	pg_free_result($result);
	pg_close($dbconn);
?>
