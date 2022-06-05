<?php
    ob_start('ob_gzhandler');
    session_start();
    
    if (isset($_SESSION['level'])) {
        if (isset($_GET['modid'])) {
            $log_dir = '/dmz/log_models_tsu';
            $ufl = $log_dir . DIRECTORY_SEPARATOR . $_GET['modid'] . '.log';
            $fh = file_get_contents ($ufl,'r');
            echo $fh;
        }
    }
    else {
        exit();
    }
?>
