<?php
    ob_start('ob_gzhandler');
    session_start();
    
    if (isset($_SESSION['level'])) {
        if (isset($_GET['modid'])) {
            $log_dir = '/ai-system/AITsunami/MODELS/GRAFIK_MODEL_REALTIME_TSUNAMI/';
            $ufl = $log_dir . DIRECTORY_SEPARATOR . $_GET['modid'] . '_2_accuracy.png';
            // header('Content-Type: image/png;base64');
            // $data = file_get_contents($ufl,'r');
            // $base64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
            // echo file_get_contents($base64,'r');

            // header('Content-Type: image/png;base64');
            // base64_decode($ufl);
            // echo file_get_contents($ufl,'r');

            $fh = header('Content-Type: image/png');
            $fh = file_get_contents ($ufl,'r');
            echo $fh;
        }
    }
    else {
        exit();
    }
?>
