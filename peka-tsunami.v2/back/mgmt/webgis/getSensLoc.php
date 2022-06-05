<?php
    ob_start('ob_gzhandler');
    session_start();

	if (isset($_SESSION['level']) && isset($_GET['timid']) && isset($_GET['ltime'])) {
        $tid = $_GET['timid'];
        $ltim = $_GET['ltime'];
    }
    else {
    	exit();
    }
	
	$dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=postgres password=adminBPPT@!")
		or die('Could not connect: ' . pg_last_error());
	
    $query = "SELECT jsonb_build_object(
                'type',     'FeatureCollection',
                'features', jsonb_agg(feature)
                )
                FROM (
                    SELECT jsonb_build_object(
                        'type',       'Feature',
                        'id',         lid,
                        'geometry',   ST_AsGeoJSON(coords)::jsonb,
                        'properties', to_jsonb(row) - 'lid' - 'coords'
                    ) AS feature
                    FROM (SELECT lokasi_sensor.lsid AS lid, 
                                CASE WHEN MAX(value) - MIN(value) > 0.5 THEN 'warn'
                                    WHEN MAX(value) - MIN(value) IS NULL THEN NULL
                                    ELSE 'normal'
                                END AS diff,
                                MAX(sensor_val_p31410000000.get_time) AS ltime,
                                lokasi_sensor.coord AS coords FROM sensor_val_p31410000000
                            RIGHT JOIN lokasi_sensor ON sensor_val_p31410000000.loc_id = lokasi_sensor.lsid
                            AND sensor_val_p31410000000.get_time <= $2
                            AND sensor_val_p31410000000.get_time >= $2 - INTERVAL '5 minutes'
                            WHERE lokasi_sensor.sensor_id=$1
                            GROUP BY lokasi_sensor.lsid, lokasi_sensor.coord) row
			    ) features;";
		
	$params = array($tid, $ltim);
	
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
