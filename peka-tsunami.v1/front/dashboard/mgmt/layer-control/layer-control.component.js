'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope, $http, $timeout, mapService, $mdDialog, $mdSidenav) {
                $timeout(function () {
                    $mdSidenav('left').open();
                });
                const dt = new Date();
                const tyear = toString(dt.getFullYear());
                $scope.activeMenu = 'datainput';
                $scope.loadingLog = false;
                $scope.activeFeature = '';
                $scope.activeModel = '';
                $scope.modelStatus = '';
                $scope.modelLevel = '';
                $scope.features = [];
                $scope.detailFrame = 'http://smong.ai-innovation.id/dashboard/mgmt/webgis/';
                var balarm = false;
                var sltid;
                const pgad = 30;
                var paglog = 0;
                $scope.loadInput = function() {
                    $http({
                        method : "GET",
                        url : "/mgmt/input/getFeatureType"
                    }).then(function querySuccess(response) {
                        var result = response.data.map(function(el) {
                            var o = Object.assign({}, el);
                            o.toggle = false;
                            return o;
                        })
                        $scope.features = angular.copy(result);
                        console.log($scope.features);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.loadModel = function() {
                    $http({
                        method : "GET",
                        url : "/mgmt/model/getModels"
                    }).then(function querySuccess(response) {
                        var result = response.data.map(function(el) {
                            var o = Object.assign({}, el);
                            o.toggle = false;
                            return o;
                        })
                        $scope.models = angular.copy(result);
                        console.log($scope.models);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.bottomData = function() {
                    $scope.loadingLog = true;
                    if (!balarm) {
                        //run the event that was passed through
                        balarm = true;
                        $timeout(function () {
                            if (balarm==true) {
                                paglog += pgad;
                                $scope.loadDetail(false, true);
                                console.log("Hit the end");
                                balarm = false;
                            }
                        }, 1000);
                    }
                }
                $scope.loadDetail = function(itm, cond) {
                    $scope.loadingLog = true;
                    if (!cond) {
                        paglog = 0;
                        sltid = itm.id;
                        $scope.activeFeature = itm.name;
                    }
                    $http({
                        method : "GET",
                        url : "/mgmt/input/getFeatureDetail",
                        params : {inpid: sltid, ofs: paglog}
                    }).then(function querySuccess(response) {
                        if (cond) {
                            var temp = $scope.dataft;
                            temp = temp.concat(response.data);
                            angular.copy(temp, $scope.dataft);
                        }
                        else {
                            $scope.dataft = angular.copy(response.data);
                        }
                        $scope.loadingLog = false;
                    }, function queryError(response) {
                        console.log('connection failed');
                        $scope.loadingLog = false;
                    });
                }
                $scope.loadModDetail = function(itm) {
                    console.log(itm.id);
                    $scope.activeModel = itm.name;
                    $scope.modelStatus = itm.status;
                    $scope.modelLevel = itm.level;
                    $scope.models.map(function(el, index) {
                        var o = Object.assign({}, el);
                        console.log(o.id);
                        if (o.id!=itm.id) {
                            $scope.models[index].toggle = false;
                        }
                        else {
                            itm.toggle = !itm.toggle;
                        }
                    })
                    //itm.toggle = !itm.toggle;
                    $http({
                        method : "GET",
                        url : "/mgmt/model/getStreamLog",
                        params : {modid: itm.id}
                    }).then(function querySuccess(response) {
                        $scope.logText = angular.copy(response.data);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.editModel = function(ev, edi) {
                    $scope.hotspotselected = false;
                    $mdDialog.show({
                        controller: 'editdialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/editdialog/editdialog.template.html',
                        targetEvent: ev,
                        locals:{dataToPass: edi}
                    }).then(function(response){
                        console.log('add data');
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.runModel = function(mid) {
                    $http({
                        method : "GET",
                        url : "/mgmt/model/getRunModel",
                        params : {idm: mid}
                    }).then(function querySuccess(response) {
                        $scope.loadModel();
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.pauseModel = function(mid) {
                    $http({
                        method : "GET",
                        url : "/mgmt/model/getPausePred",
                        params : {idm: mid}
                    }).then(function querySuccess(response) {
                        $scope.loadModel();
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.playModel = function(mid) {
                    $http({
                        method : "GET",
                        url : "/mgmt/model/getPlayPred",
                        params : {idm: mid}
                    }).then(function querySuccess(response) {
                        $scope.loadModel();
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.cancelModel = function(ev, mid) {
                    var confirm = $mdDialog.confirm()
                            .title('Membatalkan Proses Training')
                            .textContent('Apakah anda yakin untuk membatalkan proses training?')
                            .targetEvent(ev)
                            .ok('Ya')
                            .cancel('Tidak');
                    $mdDialog.show(confirm).then(function () {
                        $http({
                            method : "GET",
                            url : "/mgmt/model/getCancelModel",
                            params : {idm: mid}
                        }).then(function querySuccess(response) {
                            $scope.loadModel();
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }, function () {
                        console.log('cancel cancel');
                    });
                }
                $scope.deleteModel = function(ev, mid) {
                    var confirm = $mdDialog.confirm()
                            .title('Menghapus Model')
                            .textContent('Apakah anda yakin untuk menghapus model')
                            .targetEvent(ev)
                            .ok('Ya')
                            .cancel('Tidak');
                    $mdDialog.show(confirm).then(function () {
                        $http({
                            method : "GET",
                            url : "/mgmt/model/getDeleteModel",
                            params : {idm: mid}
                        }).then(function querySuccess(response) {
                            $scope.loadModel();
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }, function () {
                        console.log('cancel delete');
                    });
                }
                $scope.showAddNewInputDialog = function(ev) {
                    $scope.hotspotselected = false;
                    $mdDialog.show({
                        controller: 'addnewinputdialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/addnewinput/addnewinput.template.html',
                        targetEvent: ev,
                        locals:{dataToPass: $scope.features}
                    }).then(function(response){
                        console.log('add data');
                        $scope.loadInput();
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                        $scope.loadInput();
                    });
                }
                $scope.showAddNewModelDialog = function(ev) {
                    $scope.hotspotselected = false;
                    $mdDialog.show({
                        controller: 'addnewmodeldialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/addnewmodel/addnewmodel.template.html',
                        targetEvent: ev,
                        multiple: true,
                        locals:{dataToPass: $scope.features}
                    }).then(function(response){
                        $scope.loadModel();
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.downloadTemplate = function() {
                    $http({
                        method : "GET",
                        url : "/mgmt/input/getDownloadTemp"
                    }).then(function querySuccess(response) {
                        var blob = new Blob([response.data], {type: 'text/csv'});
                        saveAs(blob, 'template.csv');
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.loadInput();
            }
});
