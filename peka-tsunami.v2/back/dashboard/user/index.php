<?php
    ob_start('ob_gzhandler');
    session_start();
    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] != 'scientist') {
            header("Location:http://smong.ai-innovation.id/dashboard");
            die();
        }
    } else {
        header("Location: ../..");
        die();
    }
?>

<!doctype html>
<html class="no-js">

<head>
    <meta charset="utf-8">
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title>Peka-tsunami</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">

    <link href='http://fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,400,600,300,700'
        rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Poppins:300italic,400italic,600italic,400,600,300,700'
    rel='stylesheet' type='text/css'>
    <link href='http://fonts.googleapis.com/css?family=Inter:300italic,400italic,600italic,400,600,300,700'
        rel='stylesheet' type='text/css'>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700,400italic">
        <link rel="stylesheet" href="../bower_components/font-awesome/css/font-awesome.min.css">
    <link rel="stylesheet" href="assets/fonts/themify-icons/themify-icons.min.css">

    <link rel="stylesheet" href="assets/styles/bootstrap.css">
    <link rel="stylesheet" href="assets/styles/ui.css">
    <link rel="stylesheet" href="assets/styles/main.css">
    <link rel="stylesheet" href="assets/styles/dialog.css">
    <link rel="stylesheet" href="assets/styles/webgis.css">
    <link rel="stylesheet" href="assets/lib/v5.3.0-dist/ol.css">
    
    <link rel="stylesheet" href="assets/lib/angular-material/angular-material.css">

</head>

<body ng-app="app" id="app" class="app" data-custom-page data-off-canvas-nav ng-controller="AppCtrl"
    ng-class=" {'layout-boxed': scientist.layout === 'boxed'} ">

    <section ng-include=" 'layout/header.html' " id="header" class="header-container " ng-class="{ 'header-fixed': scientist.fixedHeader}" style="background: white;"></section>

    <div class="main-container">
        <aside ng-include=" 'layout/sidebar.html' " id="nav-container" class="nav-container" ng-class="{ 'nav-fixed': scientist.fixedSidebar}">
        </aside>

        <div id="content" class="content-container">
            <section ng-view class="view-container {{scientist.pageTransition.class}}"></section>
        </div>
    </div>

    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../bower_components/angular/angular.min.js"></script>
    <script src="../bower_components/angular-route/angular-route.min.js"></script>
    <script src="../bower_components/angular-aria/angular-aria.min.js"></script>
    <script src="../bower_components/angular-animate/angular-animate.min.js"></script>

    <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script src="../bower_components/toastr/toastr.min.js"></script>
    <script src="../bower_components/jquery.slimscroll/jquery.slimscroll.min.js"></script>
    <script src="../bower_components/angular-loading-bar/build/loading-bar.min.js"></script>
    <script src="../bower_components/angular-scroll/angular-scroll.min.js"></script>

    <script src="../bower_components/textAngular/dist/textAngular-rangy.min.js"></script>
    <script src="../bower_components/textAngular/dist/textAngular-sanitize.min.js"></script>
    <script src="../bower_components/textAngular/dist/textAngular.min.js"></script>

    <script src="../bower_components/ng-tags-input/ng-tags-input.min.js"></script>
    <script src="../bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js"></script>
    <script src="../bower_components/jquery-steps/build/jquery.steps.min.js"></script>
    <script src="../bower_components/bootstrap-file-input/bootstrap.file-input.js"></script>
    <script src="../bower_components/angular-validation-match/dist/angular-validation-match.min.js"></script>

    <script src="assets/lib/FileSaver.js"></script>
    <script src="assets/lib/v5.3.0-dist/ol.js"></script>
    <script src="assets/lib/wickedpicker.min.js"></script>
    <script src="assets/lib/angular-material/angular-material.js"></script>
    <script src="assets/lib/angular-file-upload.min.js"></script>
    <script src="assets/lib/FileSaver.js"></script>
    <script src="directive/ngFile.js"></script>
    <script src="directive/ng-slide-down.js"></script>
    <script src="directive/ng-scroll-end.js"></script>
    <script src="services/mapService_webgis.js"></script>
    <script src="services/mapService_dashboard.js"></script>
    <script src="services/mapService_simulasi.js"></script>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>
    <script src="https://cdn.jsdelivr.net/angular.chartjs/latest/angular-chart.min.js"></script>
    <script src="https://unpkg.com/hammerjs@2.0.8/hammer.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
    <script src="https://unpkg.com/muuri@0.7.1/dist/muuri.min.js"></script>
    <script src="https://unpkg.com/web-animations-js@2.3.1/web-animations.min.js"></script>
    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8=" crossorigin="anonymous"></script>

    <script src="app.module.js"></script>
    <script src="layer-control/layer-control.module.js"></script>
    <script src="layer-control/dashboard.component.js"></script>
    <script src="layer-control/data-input.component.js"></script>
    <script src="layer-control/model-ml.component.js"></script>
    <script src="layer-control/bantuan.component.js"></script>
    <script src="layer-control/webgis.component.js"></script>
    <script src="layer-control/simulasi.component.js"></script>
    
    <script src="layout/nav.module.js"></script>
    <script src="layout/nav.component.js"></script>
   
    <script src="core/app.controller.js"></script>
    <script src="core/config.route.js"></script>

    <script src="dialog/addnewmodel/addnewmodel.module.js"></script>
    <script src="dialog/addnewmodel/addnewmodel.component.js"></script>

    <script src="dialog/addnewinput/addnewinput.module.js"></script>
    <script src="dialog/addnewinput/addnewinput.component.js"></script>

    <script src="dialog/editdialog/editdialog.module.js"></script>
    <script src="dialog/editdialog/editdialog.component.js"></script>

    <script src="dialog/changepassword/changepassword.module.js"></script>
    <script src="dialog/changepassword/changepassword.component.js"></script>

    <script src="dialog/changemodel/changemodel.module.js"></script>
    <script src="dialog/changemodel/changemodel.component.js"></script>

</body>

</html>


