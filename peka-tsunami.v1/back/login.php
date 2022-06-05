<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_GET['user']) && isset($_GET['pass'])) {
        $usr = $_GET['user'];
        $paswd = $_GET['pass'];
        $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
            or die('Could not connect: ' . pg_last_error());
        $query = "SELECT uid, nama, passwd, level FROM user_tsunami
                    WHERE status=true AND nama=$1";
        $params = array($usr);
        $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
        while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
            if (password_verify($paswd, $line['passwd'])) {
                unset($line['passwd']);
                $_SESSION['level'] = $line['level'];
                $_SESSION['uid'] = $line['uid'];
                echo json_encode($line);
            }
            else {
                echo 'false';
            }
        }
        pg_free_result($result);
        pg_close($dbconn);
    }
    else {
    	exit();
    }
?>
