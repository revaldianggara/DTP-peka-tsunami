<?php
	ob_start('ob_gzhandler');
	session_start();

	if (isset($_SESSION['level']) && isset($_GET['offnum']) && isset($_GET['modid'])  && isset($_GET['ldt'])) {
		$pgofst = $_GET['offnum'];
		$mod = $_GET['modid'];
		$udt = $_GET['ldt'];
    }
    else {
    	exit();
	}
	
	if ($mod == 0) {
		$dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
			or die('Could not connect: ' . pg_last_error());
			$query = "SELECT mid FROM model_ml WHERE level=$1";
			$params = array('default');
			$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
			while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
				$mod = $line['mid'];
			}
			pg_free_result($result);
			pg_close($dbconn);
	}
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
		or die('Could not connect: ' . pg_last_error());
	
	if ($udt=='all') {
		$query = "SELECT earthquake_id.eid as id, ml_predict.mpc as pid, earthquake_id.waktu as psd, 
						CASE WHEN ml_predict.status='BERPOTENSI TSUNAMI' THEN 2
							WHEN ml_predict.status='TIDAK BERPOTENSI TSUNAMI' THEN 1
							WHEN ml_predict.status='TERKONFIRMASI TSUNAMI' THEN 3
						END AS status
				FROM ml_predict 
				INNER JOIN earthquake_id ON earthquake_id.eid=ml_predict.eid
				WHERE ml_predict.flag=true AND ml_predict.mid=$2 ORDER BY earthquake_id.waktu DESC LIMIT 10 OFFSET $1";	
		$params = array($pgofst, $mod);
	}
	else {
		$query = "SELECT earthquake_id.eid as id, ml_predict.mpc as pid, earthquake_id.waktu as psd, 
						CASE WHEN ml_predict.status='BERPOTENSI TSUNAMI' THEN 2
							WHEN ml_predict.status='TIDAK BERPOTENSI TSUNAMI' THEN 1
							WHEN ml_predict.status='TERKONFIRMASI TSUNAMI' THEN 3
						END AS status
				FROM ml_predict 
				INNER JOIN earthquake_id ON earthquake_id.eid=ml_predict.eid
				WHERE ml_predict.flag=true AND ml_predict.mid=$2 AND earthquake_id.waktu::date=$3 ORDER BY earthquake_id.waktu DESC LIMIT 10 OFFSET $1";	
		$params = array($pgofst, $mod, $udt);
	}
	
	// Performing SQL query
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	$rows = array();
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		$rows[] = $line;
	}
	echo json_encode($rows);
	pg_free_result($result);
	pg_close($dbconn);
?>
