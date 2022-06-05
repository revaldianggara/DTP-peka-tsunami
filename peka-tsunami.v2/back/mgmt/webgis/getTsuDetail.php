<?php
    ob_start('ob_gzhandler');
    session_start();

    $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
        or die('Could not connect: ' . pg_last_error());
    $query = "SELECT mid FROM model_ml WHERE level=$1";
    $params = array('default');
    $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $mod = $line['mid'];
    }
    pg_free_result($result);
	
    $query = "SELECT DISTINCT ON(eq.waktu) eq.waktu, eq.id, eq.mag, kabupaten.nama_kabupaten AS kabupaten, kabupaten.nama_provinsi AS provinsi, eq.status, ST_Distance(kabupaten.geom, eq.coord, false)/1000 AS jarak
                FROM kabupaten
                RIGHT JOIN
                (
                    SELECT earthquake_id.eid AS id, earthquake_id.coord, earthquake_id.waktu, input_feature.value AS mag,
                        CASE WHEN ml_predict.status='TIDAK BERPOTENSI TSUNAMI' THEN 0
                            WHEN ml_predict.status='BERPOTENSI TSUNAMI' THEN 1
                            WHEN ml_predict.status='TERKONFIRMASI TSUNAMI' THEN 2
                        END AS status
                    FROM earthquake_id
                    INNER JOIN input_feature ON earthquake_id.eid=input_feature.eq_id
                    INNER JOIN ml_predict ON ml_predict.eid=earthquake_id.eid
                    WHERE ml_predict.mid=$1 AND input_feature.type_id=23 AND earthquake_id.waktu > current_date - interval '3' day
                    ORDER BY earthquake_id.waktu DESC
                ) AS eq
                ON ST_Distance(kabupaten.geom, eq.coord, false)<200000
                ORDER BY 1 DESC,7;";
		
	$params = array($mod);
	
	// Performing SQL query
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
	while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
		foreach ($line as $gjson) {
			echo $gjson;
		}
	}
	pg_free_result($result);
	pg_close($dbconn);
?>
