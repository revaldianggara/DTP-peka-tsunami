<?php
    ob_start('ob_gzhandler');
    session_start();

        if (isset($_GET['year'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT extract(year FROM waktu) as year, extract(MONTH FROM waktu) as month, count(*) as count
                        FROM earthquake_id
                        WHERE extract(year FROM waktu)=$1
                        GROUP BY 1, extract(month FROM waktu);";
            $params = array($_GET['year']);
            // $rows = array();
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                $rows[] = $line;
            }
            echo json_encode($rows);
            pg_free_result($result);
            pg_close($dbconn);
        }
?>
