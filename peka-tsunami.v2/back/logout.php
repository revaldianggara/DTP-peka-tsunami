<?php
    session_start();

    if (isset($_SESSION['level'])) {
        echo 'logout';
        session_destroy();
        die();
    }
?>