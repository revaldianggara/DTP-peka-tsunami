<?php
    ob_start('ob_gzhandler');
    session_start();
    // if (isset($_SESSION['level'])) {
            $dbconn = pg_connect("host=127.0.0.1 dbname=hw_stats user=aifire password=@!fire2020")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT json_agg(cstat)
                        FROM (
                            SELECT sys_name as name, to_char(get_time, 'yyyy-MM-dd HH24:MI:SS') as time, json_agg(json_build_object('hw', status_name, 'val', value)) AS tags FROM systat GROUP BY (sys_name, get_time) ORDER BY sys_name DESC
                        ) as cstat";
            $rows = array();
            $result = pg_query_params($dbconn, $query, $rows) or die('Query failed: ' . pg_last_error());
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                echo $line['json_agg'];
            }
            //echo $rows;
            pg_free_result($result);
            pg_close($dbconn);
        
    // }
    // else {
    //     exit();
    // }
?>