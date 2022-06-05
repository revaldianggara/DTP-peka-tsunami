<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        echo 'Under Construction';
    }
    else {
        exit();
    }
?>