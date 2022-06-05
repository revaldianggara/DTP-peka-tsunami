<?php
	ob_start('ob_gzhandler');
	session_start();
	// Connecting, selecting database

	if (isset($_GET['fid']) && isset($_GET['type'])) {
		if (is_numeric($_GET['fid'])){
			$hsid = $_GET['fid'];
			$type_used = $_GET['type'];
		}
		else { exit(); }
    }
    else { exit(); }
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
        or die('Could not connect: ' . pg_last_error());
    $query = "SELECT mid FROM model_ml WHERE level=$1";
    $params = array('default');
    $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $mod = $line['mid'];
    }
    pg_free_result($result);

	$tab_used = 'output_tsunami';
	$id_used = 'tid';
	if ($type_used == 'EQ') {
		$query = "SELECT feature_id.nama_feature AS parameter, input_feature.value AS value, earthquake_id.waktu AS dtm, REPLACE(REPLACE(REPLACE(ST_AsText(earthquake_id.coord, 5), 'POINT(', ''), ' ', ', '), ')', '')  AS coord, ml_predict.status FROM earthquake_id
					LEFT JOIN ml_predict on ml_predict.eid=earthquake_id.eid
					LEFT JOIN input_feature on earthquake_id.eid=input_feature.eq_id
					LEFT JOIN feature_id on feature_id.fid=input_feature.type_id
					WHERE ml_predict.mid=$2 AND earthquake_id.eid=$1 AND feature_id.fid IN (23,28,27,17);";
		$params = array($hsid, $mod);
	}
	elseif ($type_used == 'predTsu') {
		$query = "SELECT output_tsunami.tid AS id, output_tsunami.kecepatan AS Kecepatan, output_tsunami.ketinggian AS Ketinggian, output_tsunami.eta AS ETA, REPLACE(REPLACE(REPLACE(ST_AsText(tsunami_simulasi.coord, 5), 'POINT(', ''), ' ', ', '), ')', '')  AS Koordinat, tsunami_simulasi.nama_area AS Area FROM output_tsunami
					LEFT JOIN tsunami_simulasi ON output_tsunami.lokasi_id=tsunami_simulasi.sid
					WHERE output_tsunami.tid=$1;";
		$params = array($hsid);
	}
	$rows = array();
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		$rows[] = $line;
	}
	echo json_encode($rows);
	pg_free_result($result);
	pg_close($dbconn);
?>
