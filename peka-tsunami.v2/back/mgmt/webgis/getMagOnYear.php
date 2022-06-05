<?php
    ob_start('ob_gzhandler');
    session_start();
   
    if (isset($_SESSION['level'])) {
        if (isset($_GET['year'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT ceil(input_feature.value) AS mag,
                            count(ceil(input_feature.value)) AS nof
                        FROM input_feature 
                        INNER JOIN earthquake_id ON earthquake_id.eid=input_feature.eq_id
                        WHERE extract(year FROM earthquake_id.waktu)=$1 AND input_feature.type_id=23
                        GROUP BY 1";
            $params = array($_GET['year']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            $romows = array();
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
