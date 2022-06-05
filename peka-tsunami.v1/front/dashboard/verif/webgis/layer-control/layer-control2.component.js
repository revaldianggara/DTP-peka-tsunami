'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control2.template.html',
        controller:
            function layercontrolController($scope, $http, $mdSidenav, $timeout, mapService,$mdDialog) {
                $timeout(function () {
                    $mdSidenav('left').open();
                });
                const ctime = new Date();
                $scope.toggle = {};
                var falarm1 = false;
                var falarm2 = false;
                
                const pgad = 10;
                var pagn1 = 0;
                var pagn2 = 0;
                
                $scope.toggle.list1 = true;
                $scope.predDateGroup = [];
                $scope.hsDateGroup = [];
                
                $scope.ifdw = mapService.info_window;
                $scope.bottomPred = function() {
                    if (!falarm1) {
                        //run the event that was passed through
                        falarm1 = true;
                        $timeout(function () {
                            if (falarm1==true) {
                                pagn1 += pgad;
                                $scope.refreshListPred(pagn1);
                                console.log("Hit the end");
                                falarm1 = false;
                            }
                        }, 500);
                    }
                }
                $scope.refreshListPred = function(ofs) {
                    $http({
                        method : "GET",
                        url : "/getDatePred",
                        params : {offnum: ofs}
                    }).then(function querySuccess(response) {
                        if (response.data.length > 0) {
                            var temp = $scope.predDateGroup;
                            temp = temp.concat(response.data);
                            angular.copy(temp, $scope.predDateGroup);
                            console.log($scope.predDateGroup);
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.bottomHS = function() {
                    if (!falarm2) {
                        //run the event that was passed through
                        falarm2 = true;
                        $timeout(function () {
                            if (falarm2==true) {
                                pagn2 += pgad;
                                $scope.refreshListHS(pagn2);
                                console.log("Hit the end");
                                falarm2 = false;
                            }
                        }, 500);
                    }
                }
                $scope.refreshListHS = function(ofs) {
                    $http({
                        method : "GET",
                        url : "/getDateHS",
                        params : {offnum: ofs}
                    }).then(function querySuccess(response) {
                        if (response.data.length > 0) {
                            var temp = $scope.hsDateGroup;
                            temp = temp.concat(response.data);
                            angular.copy(temp, $scope.hsDateGroup);
                            console.log($scope.hsDateGroup);
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                
                $scope.dateCompare = function(targ) {
                    const tgtime = new Date(targ);
                    if (tgtime >= ctime) {
                        return true
                    } else {
                        return false
                    }
                }
                $scope.chooseModel = function(ev) {
                    $mdDialog.show({
                        controller: 'changemodeldialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/changemodel/changemodel.template.html',
                        targetEvent: ev
                    }).then(function(response){
                        console.log('add data');
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.predItemCheck = function(tid_chk) {
                    $scope.predDateGroup.filter(function(hsit) {
                        if (hsit.tid == tid_chk) {
                            if (hsit.check) {
                                console.log(tid_chk);
                                $http({
                                    method : "GET",
                                    url : "/getPredHS",
                                    params : {timid: tid_chk}
                                }).then(function querySuccess(response) {
                                    if (response.data.features.length > 0) {
                                        mapService.drawHS('predHS_'+tid_chk, response.data);
                                    }
                                }, function queryError(response) {
                                    console.log('connection failed');
                                });
                            } else {
                                console.log("close "+tid_chk);
                                mapService.removeHS('predHS_'+tid_chk);
                            }
                        }
                    });
                }
                $scope.hsItemCheck = function(tid_chk) {
                    console.log(tid_chk);
                    $scope.hsDateGroup.filter(function(hsit) {
                        if (hsit.tid == tid_chk) {
                            if (hsit.check) {
                                console.log(tid_chk);
                                $http({
                                    method : "GET",
                                    url : "/getHS",
                                    params : {timid: tid_chk}
                                }).then(function querySuccess(response) {
                                    if (response.data.features.length > 0) {
                                        mapService.drawHS('HS_'+tid_chk, response.data);
                                    }
                                }, function queryError(response) {
                                    console.log('connection failed');
                                });
                            } else {
                                console.log("close "+tid_chk);
                                mapService.removeHS('HS_'+tid_chk);
                            }
                        }
                    });
                }
                
                $scope.closePopup = function(id2clos) {
                    console.log(id2clos);
                    mapService.removePopup(id2clos);
                }
                $scope.refreshListPred(0);
                $scope.refreshListHS(0);
                
            }
});