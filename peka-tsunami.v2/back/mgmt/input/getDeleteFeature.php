<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['idf'])) {
            echo $_GET['idf'];
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "DELETE FROM feature_id WHERE status IS NULL AND fid=$1 RETURNING fid";
            $params = array($_GET['idf']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            $rows = array();
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $mod = $line['fid'];
            }
            pg_free_result($result);
            $query = "DELETE FROM input_feature WHERE type_id=$1";
            $params = array($mod);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            pg_free_result($result);
            pg_close($dbconn);
        }
    }
    else {
        exit();
    }
?>