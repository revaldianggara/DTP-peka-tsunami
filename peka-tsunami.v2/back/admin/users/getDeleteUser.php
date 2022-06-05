<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] == 'admin') {
            if(isset($_GET['userid'])) {
                $usrid = $_GET['userid'];
                $dbconn = pg_connect("host=127.0.0.1 dbname=aitsunami_db user=aitsu password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());

                $query = "DELETE FROM user_tsunami
                            WHERE uid=$1;";
                $params = array($usrid);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                pg_free_result($result);
                pg_close($dbconn);
            }
        }
    }
?>