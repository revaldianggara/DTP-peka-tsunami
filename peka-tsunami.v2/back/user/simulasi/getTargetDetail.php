<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['target_id'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=simulasitsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT ST_X(coord::geometry) as lon, ST_Y(coord::geometry) as lat, elev, ssh, eta, pred_ssh, pred_eta, beda_ssh, beda_eta, keterangan
                        FROM tsunami_target
                        WHERE tid=$1";
            $params = array($_GET['target_id']);
            $rows = array();
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
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