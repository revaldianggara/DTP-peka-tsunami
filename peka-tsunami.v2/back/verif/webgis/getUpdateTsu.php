<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level']=='verifikator') {
            if (isset($_GET['tsuid']) && isset($_GET['nust'])) {
                $newstat = 'BERPOTENSI TSUNAMI';
                if ($_GET['nust']==1) {
                    $newstat = 'TIDAK BERPOTENSI TSUNAMI';
                }
                elseif ($_GET['nust']==3) {
                    $newstat = 'TERKONFIRMASI TSUNAMI';
                }
                $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());
                $query = "UPDATE ml_predict SET status=$1
                            WHERE mpc=$2;";
                $params = array($newstat, $_GET['tsuid']);
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