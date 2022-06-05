<?php
	ob_start('ob_gzhandler');
	session_start();
    if (isset($_GET['eq_id'])) {
        $eid = $_GET['eq_id'];
    }
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
                'id',         tid,
                'geometry',   ST_AsGeoJSON(coord)::jsonb,
                'properties', to_jsonb(row) - 'tid' - 'coord'
            ) AS feature
            FROM (SELECT output_tsunami.tid AS tid, tsunami_simulasi.coord AS coord,
							CASE WHEN 0.3<output_tsunami.ketinggian AND output_tsunami.ketinggian<=1 THEN 1
								WHEN 1<output_tsunami.ketinggian AND output_tsunami.ketinggian<=2 THEN 2
								WHEN 2<output_tsunami.ketinggian AND output_tsunami.ketinggian<=5 THEN 3
								WHEN 5<output_tsunami.ketinggian AND output_tsunami.ketinggian<=10 THEN 4
								WHEN output_tsunami.ketinggian>10 THEN 5
							END AS level
					FROM output_tsunami
					LEFT JOIN tsunami_simulasi ON output_tsunami.lokasi_id=tsunami_simulasi.sid
					WHERE output_tsunami.eq_id=$1 AND model_id = $2 AND output_tsunami.ketinggian>0.3) row
        ) features;";
		
	$params = array($eid, $mod);
	
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
