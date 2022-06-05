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
	
    $query = "SELECT jsonb_build_object(
        'type',     'FeatureCollection',
        'features', jsonb_agg(feature)
        )
        FROM (
            SELECT jsonb_build_object(
                'type',       'Feature',
                'id',         eid,
                'geometry',   ST_AsGeoJSON(coord)::jsonb,
                'properties', to_jsonb(row) - 'eid' - 'coord'
            ) AS feature
            FROM (SELECT earthquake_id.eid,earthquake_id.coord,
                    CASE WHEN ml_predict.status='TIDAK BERPOTENSI TSUNAMI' THEN 0
                        WHEN ml_predict.status='BERPOTENSI TSUNAMI' THEN 1
                        WHEN ml_predict.status='TERKONFIRMASI TSUNAMI' THEN 2
                    END AS status
                FROM earthquake_id 
                INNER JOIN ml_predict ON ml_predict.eid=earthquake_id.eid
                WHERE ml_predict.mid=$1 AND waktu > (now() at time zone 'utc') - INTERVAL '1800 minutes') row
        ) features;";
		
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
