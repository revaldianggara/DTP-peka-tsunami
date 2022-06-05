<?php
    ob_start('ob_gzhandler');
    session_start();
    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] != 'management') {
            header("Location:http://smong.ai-innovation.id/dashboard");
            die();
        }
    } else {
        header("Location: ../..");
        die();
    }
?>
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard AI Tsunami</title>
    <meta name="viewport" content="initial-scale=1.0">
    <meta charset="utf-8">
    <link rel="stylesheet" href="lib/angular-material/angular-material.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
    <link rel="stylesheet" href="lib/v5.3.0-dist/ol.css">
    <link rel="stylesheet" href="app.css">
    <link rel="stylesheet" href="header/header.css">
    <link rel="stylesheet" href="layer-control/layer-control.css">
    <link rel="stylesheet" href="dialog/addnewmodel/addnewmodel.css">
</head>
<body ng-app="untitled">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-animate.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-aria.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular-messages.min.js"></script>
    <script src="lib/angular-material/angular-material.js"></script>
    <script src="lib/angular-file-upload.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>
    <script src="lib/v5.3.0-dist/ol.js"></script>
    <script src="lib/FileSaver.js"></script>
    <script src="services/mapService.js"></script>
    <script src="directive/ngFile.js"></script>
    <script src="directive/ng-scroll-end.js"></script>
    <script src="app.module.js"></script>
    <script src="header/header.module.js"></script>
    <script src="header/header.component.js"></script>
    <script src="layer-control/layer-control.module.js"></script>
    <script src="layer-control/layer-control.component.js"></script>
    <script src="dialog/addnewinput/addnewinput.module.js"></script>
    <script src="dialog/addnewinput/addnewinput.component.js"></script>
    <script src="dialog/addnewmodel/addnewmodel.module.js"></script>
    <script src="dialog/addnewmodel/addnewmodel.component.js"></script>
    <script src="dialog/editdialog/editdialog.module.js"></script>
    <script src="dialog/editdialog/editdialog.component.js"></script>
    <script src="dialog/changepassword/changepassword.module.js"></script>
    <script src="dialog/changepassword/changepassword.component.js"></script>
    <header></header>
    <div class="contain" layout-fill flex>
        <layer-control></layer-control>
    </div>
    <!--<img class="vendor-image" src="img/image/logo.png">-->
</body>
</html>
