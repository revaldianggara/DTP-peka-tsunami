<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['nm'])) {
            $mldata = json_decode($_GET['nm']);
            if (isset($mldata->name) && isset($mldata->InputFeatures) && isset($mldata->simid) && isset($mldata->mlid)) {
                $date = date('Y-m-d H:i:s');
                $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());
                $query = "INSERT INTO model_ml (nama_model, model_file_path, ml_type, ml_prop, input_feature, status, user_id, get_time, sm_type)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);";
                $params = array($mldata->name, "None", $mldata->mlid, $mldata->mlprop, $mldata->InputFeatures, 'waiting', $_SESSION['uid'], $date, $mldata->simid);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
            else {
                exit();
            }
        }
        else {
            exit();
        }
    }
    else {
        exit();
    }
?>