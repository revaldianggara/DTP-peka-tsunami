<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level']=='management') {
            if (isset($_GET['idm'])) {
                $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());
                $query = "UPDATE model_ml
                            SET status='cancelled'
                            WHERE status!='finish' AND mid=$1";
                $params = array($_GET['idm']);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
        }
    }
    else {
        exit();
    }
?>
