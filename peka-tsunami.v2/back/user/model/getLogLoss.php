<?php
    ob_start('ob_gzhandler');
    session_start();
    
    if (isset($_SESSION['level'])) {
        if (isset($_GET['modid'])) {
            $log_dir = '/ai-system/AITsunami/MODELS/GRAFIK_MODEL_REALTIME_TSUNAMI/';
            $ufl = $log_dir . DIRECTORY_SEPARATOR . $_GET['modid'] . '_2_loss.png';
            header('Content-Type: image/png');
            base64_decode($ufl);
            echo file_get_contents($ufl,'r');
        }
    }
    else {
        exit();
    }
?>
