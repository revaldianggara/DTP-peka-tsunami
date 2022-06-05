<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['modid'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT model_ml.mid as id, model_ml.nama_model as name, model_ml.ml_prop as prop, ml_type.nama_ml as mltype, simul_type.nama_simul as simtype FROM model_ml
                        INNER JOIN ml_type
                        ON model_ml.ml_type = ml_type.mlid
                        INNER JOIN simul_type
                        ON model_ml.sm_type = simul_type.smid
                        WHERE mid=$1";
            $params = array($_GET['modid']);
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
