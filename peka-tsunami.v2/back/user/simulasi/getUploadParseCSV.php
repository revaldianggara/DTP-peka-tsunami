<?php
    ob_start('ob_gzhandler');
    session_start();
    
    if (isset($_SESSION['level'])) {
        if (!empty($_FILES )){
            if (isset($_POST['rid_option'])) {
                $temp = $_FILES[ 'csv' ]['tmp_name'];
                $regid = $_POST['rid_option'];
                // $_POST['regselect']
                $csvAsArray = array_map('str_getcsv', file($temp));
                $head = 0;
                $source_id = array();
                $target_sid = array();
                $dbconn = pg_connect("host=127.0.0.1 dbname=simulasitsunami_db user=aitsu password=caritausendiri")
                    or die('Could not connect: ' . pg_last_error());
                $query = "INSERT INTO eq_source (region_id, id_score, source_id, coord, magnitude, depth, dev12, dev27, dev62, dev187, jrk_trs, jrk_pth)
                            VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($4, $5), 4326), $6, $7, $8, $9, $10, $11, $12, $13)
                            ON CONFLICT DO NOTHING";
                $query2 = "INSERT INTO tsunami_target (eq_id, coord, elev, ssh, eta, pred_ssh, pred_eta, beda_ssh, beda_eta, keterangan)
                            (SELECT sid, ST_SetSRID(ST_MakePoint($2, $3), 4326), $4, $5, $6, $7, $8, $9, $10, $11 FROM eq_source WHERE source_id=$1)
                            ON CONFLICT DO NOTHING";
                foreach ($csvAsArray as $line) {
                    if ($head==0) {
                        $head = 1;
                    }
                    else {
                        if (count($line)==23) {
                            if (!in_array($line[1], $source_id)){
                                $source_id[] = $line[1];
                                $params = array_slice($line, 0, 12);
                                array_unshift($params, $regid);
                                print_r($params);
                                $result = pg_query_params($dbconn, $query, $params) or die('Query failed: ' . pg_last_error());
                            }
                            pg_free_result($result);
                            $params2 = array_slice($line, 13, 10);
                            array_unshift($params2, $line[1]);
                            print_r($params2);
                            $result = pg_query_params($dbconn, $query2, $params2) or die('Query failed: ' . pg_last_error());
                        }
                    }
                }
                pg_free_result($result);
                pg_close($dbconn);
                // echo 'insert finish';
                sleep(4);
                header("Location:http://smong.ai-innovation.id/dashboard/user/index#/layer-control/simulasi/");
            }
            else {
                echo 'Region belum dipilih';
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
