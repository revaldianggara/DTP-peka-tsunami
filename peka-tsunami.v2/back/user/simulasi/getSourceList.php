<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['reg_id'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=simulasitsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT sid AS id, source_id AS id_s, magnitude as mag
                        FROM eq_source
                        WHERE region_id=$1
                        ORDER BY 2";
            $params = array($_GET['reg_id']);
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