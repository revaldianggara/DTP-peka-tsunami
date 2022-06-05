<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if (isset($_GET['regname'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=simulasitsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "INSERT INTO region (nama)
                        VALUES ($1)
                        ON CONFLICT (nama) DO NOTHING";
            $params = array($_GET['regname']);
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
?>