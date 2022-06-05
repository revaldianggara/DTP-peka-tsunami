<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=postgres password=adminBPPT@!")
            or die('Could not connect: ' . pg_last_error());
        $query = "SELECT mid as id, nama_model as name, status,level FROM model_ml
                    WHERE status!='deleted' AND user_id=$1";
        $params = array($_SESSION['uid']);
        $rows = array();
        $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
        while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
            $rows[] = $line;
        }
        echo json_encode($rows);
        pg_free_result($result);
        pg_close($dbconn);
    }
    else {
        exit();
    }
?>
