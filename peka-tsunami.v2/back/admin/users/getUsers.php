<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'admin') {
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT uid as id, nama as nama, email as email, created_time as tgl_pembuatan,
                        CASE WHEN level='scientist' THEN 'Data Scientist'
                            WHEN level='verifikator' THEN 'Verifikator'
                            WHEN level='management' THEN 'Model Approver'
                        END as level FROM user_tsunami
                        WHERE status=true AND level!='admin'";
            $rows = array();
            $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
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