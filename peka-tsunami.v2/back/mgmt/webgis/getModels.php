<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level']) && isset($_SESSION['level'])) {
        $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
            or die('Could not connect: ' . pg_last_error());
        $query = "SELECT model_ml.mid as id, model_ml.nama_model as name, model_ml.level as level, user_tsunami.nama as author, model_ml.get_time as time  FROM model_ml
                    INNER JOIN user_tsunami ON model_ml.user_id=user_tsunami.uid
                    WHERE model_ml.status='finish' ORDER BY model_ml.get_time DESC";
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