<?php
    ob_start('ob_gzhandler');
    session_start();
   
    $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
        or die('Could not connect: ' . pg_last_error());
    $query = "SELECT DISTINCT ON(eq.waktu) eq.waktu, eq.id, eq.mag, UPPER(kabupaten.nama_kabupaten) AS kabupaten, UPPER(kabupaten.nama_provinsi) AS provinsi, 
								ROUND(ST_Distance(kabupaten.geom, eq.coord, false)::NUMERIC/1000, 1) AS jarak
                FROM kabupaten
                RIGHT JOIN
                (
                    SELECT earthquake_id.eid AS id, earthquake_id.coord, earthquake_id.waktu, input_feature.value AS mag
                    FROM earthquake_id
                    INNER JOIN input_feature ON earthquake_id.eid=input_feature.eq_id
                    -- WHERE input_feature.type_id=23 AND earthquake_id.waktu > current_date - interval '3' day
                    WHERE input_feature.type_id=23 AND earthquake_id.waktu > current_date - interval '1' day
                    ORDER BY earthquake_id.waktu DESC
                ) AS eq
                ON ST_Distance(kabupaten.geom, eq.coord, false)<200000
                -- DESC,6
                ORDER BY 1 DESC";
    $rows = array();
    $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rows[] = $line;
    }
    echo json_encode($rows);
    pg_free_result($result);
    pg_close($dbconn);
?>
