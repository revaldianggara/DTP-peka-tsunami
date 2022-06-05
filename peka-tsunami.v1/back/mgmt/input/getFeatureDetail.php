<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['inpid']) && isset($_GET['ofs'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT earthquake_id.eid AS id, REPLACE(REPLACE(REPLACE(ST_AsText(earthquake_id.coord, 5), 'POINT(', ''), ' ', ', '), ')', '')  AS coord, earthquake_id.waktu AS time, input_feature.value AS value FROM input_feature 
                        INNER JOIN earthquake_id ON earthquake_id.eid=input_feature.eq_id
                        WHERE type_id=$1 ORDER BY waktu DESC LIMIT 30 OFFSET $2;";
            $params = array($_GET['inpid'], $_GET['ofs']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            $rows = array();
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $rows[] = $line;
            }
            echo json_encode($rows);
            pg_free_result($result);
            pg_close($dbconn);
        }
    }
    else {
        exit();
    }
?>