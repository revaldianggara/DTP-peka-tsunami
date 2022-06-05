<?php
    ob_start('ob_gzhandler');
    session_start();

    if (isset($_SESSION['level'])) {
        if ( !empty( $_FILES ) && isset($_POST['nof']) ) {
            $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
            $feature_dir = '/dmz/upload_tsu';
            $udir = $feature_dir . DIRECTORY_SEPARATOR . $_POST['nof'];
            if (!is_dir($udir)) {
                mkdir($udir, 0777, true);
            }
            $target_dir = $udir . DIRECTORY_SEPARATOR . $_POST['nof'] . '_input.csv';
            if ( ! is_writeable ( $udir ) ) {
                echo 'directory not writeable';
            }
            if (move_uploaded_file( $tempPath, $target_dir )) {
                $answer = array( 'answer' => 'File transfer completed' );
                $json = json_encode( $answer );
                echo $json;
            }
            else {
                echo 'something wrong';
            }
        } 
        else {
            echo 'No files';
        }
    }
    else {
        exit();
    }
?>