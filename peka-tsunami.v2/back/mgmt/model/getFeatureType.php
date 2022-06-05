<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
            or die('Could not connect: ' . pg_last_error());
        $query = "SELECT fid as idi, nama_feature AS name, status FROM feature_id";
        $rows = array();
        $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
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