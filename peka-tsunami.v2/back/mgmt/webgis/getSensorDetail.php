<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['timid']) && isset($_GET['locid']) && isset($_GET['senid'])  && isset($_GET['intvl'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=postgres password=adminBPPT@!")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT get_time AS time, value FROM sensor_val_p31410000000
                        WHERE sensor_id=$1 AND loc_id=$2 AND get_time < $3 AND get_time > $3::timestamp - INTERVAL '1 minutes'*$4 ORDER BY get_time;";
            $params = array($_GET['senid'], $_GET['locid'], $_GET['timid'], $_GET['intvl']);
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