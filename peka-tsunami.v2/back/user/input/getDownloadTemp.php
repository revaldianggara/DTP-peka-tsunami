<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
            or die('Could not connect: ' . pg_last_error());
        $query = "SELECT eid as id, REPLACE(REPLACE(REPLACE(ST_AsText(coord, 5), 'POINT(', ''), ' ', ', '), ')', '')  AS coord, waktu FROM earthquake_id";
        $rows = array();
        $headers = ['id','bujur-lintang','waktu','nilai parameter'];
        $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
        $fp = fopen('php://output', 'w');
        if ($fp && $result) {
            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="template.csv"');
            header('Pragma: no-cache');
            header('Expires: 0');
            fputcsv($fp, $headers);
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                fputcsv($fp, array_values($line));
            }
        }
        fclose($fp);
        pg_free_result($result);
        pg_close($dbconn);
    }
    else {
        exit();
    }
?>