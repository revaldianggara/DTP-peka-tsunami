<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['uid'])) {
        if (isset($_GET['opass']) && isset($_GET['npass'])) {
            $oldp = $_GET['opass'];
            $newp = $_GET['npass'];
            $dbconn = pg_connect("host=127.0.0.1 dbname=tsunami_db user=aitsu password=caritausendiri")
                or die('Could not connect: ' . pg_last_error());
            $query = "SELECT uid, passwd, level FROM user_tsunami
                        WHERE uid=$1";
            $params = array($_SESSION['uid']);
            $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            $ckpass = 0;
            while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                if (password_verify($oldp, $line['passwd'])) {
                    $ckpass = 1;
                }
                else {
                    echo 'false';
                }
            }
            pg_free_result($result);
            if ($ckpass==1) {
                $paswd = password_hash($newp, PASSWORD_DEFAULT);
                $query = "UPDATE user_tsunami SET passwd = $1 WHERE uid=$2;";
                $params = array($paswd, $_SESSION['uid']);
                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
            }
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