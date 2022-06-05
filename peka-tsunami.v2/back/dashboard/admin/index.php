<?php
    ob_start('ob_gzhandler');
    session_start();
    if (isset($_SESSION['level'])) {
        if ($_SESSION['level'] != 'admin') {
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
    <link rel="stylesheet" href="assets/fonts/themify-icons/themify-icons.min.css">
    <link rel="stylesheet" href="assets/fonts/font-awesome/css/font-awesome.min.css">

    <link rel="stylesheet" href="assets/lib/angular-material/angular-material.css">

    <link rel="stylesheet" href="assets/styles/bootstrap.css">
    <link rel="stylesheet" href="assets/styles/ui.css">
    <link rel="stylesheet" href="assets/styles/main.css">
    <link rel="stylesheet" href="assets/styles/dialog.css">

</head>

<body ng-app="app" id="app" class="app" data-custom-page data-off-canvas-nav ng-controller="AppCtrl">

    <section ng-include=" 'layout/header.html' " id="header" class="header-container " ng-class="{ 'header-fixed': admin.fixedHeader}" style="background: white;"></section>

    <div class="main-container">
        <aside ng-include=" 'layout/sidebar.html' " id="nav-container" class="nav-container" ng-class="{ 'nav-fixed': admin.fixedSidebar}">
        </aside>

        <div id="content" class="content-container">
            <section ng-view class="view-container {{admin.pageTransition.class}}"></section>
        </div>
    </div>

    <script src="../bower_components/jquery/dist/jquery.min.js"></script>
    <script src="../bower_components/angular/angular.min.js"></script>
    <script src="../bower_components/angular-route/angular-route.min.js"></script>
    <script src="../bower_components/angular-aria/angular-aria.min.js"></script>
    <script src="../bower_components/angular-animate/angular-animate.min.js"></script>

    <script src="../bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js"></script>
    <script src="../bower_components/jquery.slimscroll/jquery.slimscroll.min.js"></script>
    <script src="../bower_components/angular-scroll/angular-scroll.min.js"></script>

    <script src="../bower_components/ng-tags-input/ng-tags-input.min.js"></script>
    <script src="../bower_components/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js"></script>
    <script src="../bower_components/jquery-steps/build/jquery.steps.min.js"></script>
    <script src="../bower_components/bootstrap-file-input/bootstrap.file-input.js"></script>
    <script src="../bower_components/angular-validation-match/dist/angular-validation-match.min.js"></script>

    <script src="assets/lib/echarts.js"></script>
    <script src="assets/lib/ngecharts.js"></script>
    <script src="assets/lib/angular-material/angular-material.js"></script>

    <script src="app.module.js"></script>
    <script src="layer-control/layer-control.module.js"></script>
    <script src="layer-control/pengguna.component.js"></script>
    <script src="layer-control/monitoring.component.js"></script>
    <script src="layer-control/hwstats.component.js"></script>
    <script src="layer-control/bantuan.component.js"></script>

    <script src="dialog/adduser/adduser.module.js"></script>
    <script src="dialog/adduser/adduser.component.js"></script>

    <script src="dialog/edituser/edituser.module.js"></script>
    <script src="dialog/edituser/edituser.component.js"></script>

    <script src="dialog/changepassword/changepassword.module.js"></script>
    <script src="dialog/changepassword/changepassword.component.js"></script>

    <script src="../../directive/ng-scroll-end.js"></script>

    <script src="layout/nav.module.js"></script>
    <script src="layout/nav.component.js"></script>
    
    <script src="core/app.controller.js"></script>
    <script src="core/config.route.js"></script>

</body>

</html>






