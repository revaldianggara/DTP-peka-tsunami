<?php
	ob_start('ob_gzhandler');
    session_start();
	
    if (isset($_SESSION['level'])) {
        if (isset($_GET['source_id'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=simulasitsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            
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
                    FROM (SELECT tid, coord FROM tsunami_target WHERE eq_id = $1) row
                ) features;";
                
            $params = array($_GET['source_id']);
            
            // Performing SQL query
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                foreach ($line as $gjson) {
                    echo $gjson;
                }
            }
            pg_free_result($result);
            pg_close($dbconn);
        }
    }
?>
