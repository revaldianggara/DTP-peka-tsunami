<?php
    session_start();

    if (isset($_SESSION['level'])) {
        echo $_SESSION['level'];
    }
    else {
        echo 'false';
    }
?>