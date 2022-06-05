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
	
    $query = "SELECT DISTINCT ON(eq.waktu) eq.waktu, eq.id, eq.mag, UPPER(kabupaten.nama_kabupaten) AS kabupaten, UPPER(kabupaten.nama_provinsi) AS provinsi, eq.status, 
    ROUND(ST_Distance(kabupaten.geom, eq.coord, false)::NUMERIC/1000, 1) AS jarak
                FROM kabupaten
                RIGHT JOIN
                (
                    SELECT earthquake_id.eid AS id, earthquake_id.coord, earthquake_id.waktu, input_feature.value AS mag, ' ' ,ml_predict.status AS status
                    FROM earthquake_id
                    INNER JOIN input_feature ON earthquake_id.eid=input_feature.eq_id
                    INNER JOIN ml_predict ON ml_predict.eid=earthquake_id.eid
                    WHERE ml_predict.mid=$1 AND input_feature.type_id=23 AND earthquake_id.waktu  > current_date - interval '1' day
                    ORDER BY earthquake_id.waktu DESC
                ) AS eq
                ON ST_Distance(kabupaten.geom, eq.coord, false)<200000
                -- DESC,7
                ORDER BY 1 DESC";
	$params = array($mod);
	$result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
    $romows = array();
    while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
        $rows[] = $line;
    }
    echo json_encode($rows);
	pg_free_result($result);
	pg_close($dbconn);
?>
