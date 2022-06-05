'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope, $http, $mdSidenav, $timeout, mapService, $mdDialog, $interval) {
                $timeout(function () {
                    $mdSidenav('left').open();
                });
                $("#chartarea").hide();
                $scope.toggle = {};
                var falarm1 = false;
                var falarm2 = false;
                var modsel = 0;
                const pgad = 10;
                var pagn1 = 0;
                var pagn2 = 0;
                var sensdtm = new Date().toISOString();
                var eqdt = 'all';
                var tsudt = 'all';
                var timepicker;
                var senslatest = true;
                $scope.toggle.list1 = true;
                $scope.predDateGroup = [];
                $scope.eqDateGroup = [];
                $scope.sensorGroup = [];
                $scope.hs = mapService.info_detail;
                $scope.cancelChangeTime = function() {
                    $mdDialog.cancel('cancel');
                }
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
                        url : "/mgmt/webgis/getDatePred",
                        params : {offnum: ofs, modid: modsel, ldt: tsudt}
                    }).then(function querySuccess(response) {
                        if (response.data.length > 0) {
                            var temp = $scope.predDateGroup;
                            temp = temp.concat(response.data);
                            angular.copy(temp, $scope.predDateGroup);
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.refreshListPred2 = function(ofs) {
                    $http({
                        method : "GET",
                        url : "/mgmt/webgis/getDatePred",
                        params : {offnum: ofs, modid: modsel, ldt: tsudt}
                    }).then(function querySuccess(response) {
                        var result = response.data.map(function(el) {
                            var o = Object.assign({}, el);
                            $scope.predDateGroup.filter(function(hsit) {
                                if (hsit.id == o.id) {
                                    if (hsit.check) {
                                        o.check = true;
                                    } else {
                                        o.check = false;
                                    }
                                }
                            });
                            return o;
                        })
                        angular.copy(result, $scope.predDateGroup);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.bottomEQ = function() {
                    if (!falarm2) {
                        //run the event that was passed through
                        falarm2 = true;
                        $timeout(function () {
                            if (falarm2==true) {
                                pagn2 += pgad;
                                $scope.refreshListEQ(pagn2);
                                console.log("Hit the end");
                                falarm2 = false;
                            }
                        }, 500);
                    }
                }
                $scope.refreshListEQ = function(ofs) {
                    $http({
                        method : "GET",
                        url : "/mgmt/webgis/getDateEQ",
                        params : {offnum: ofs, ldt: eqdt}
                    }).then(function querySuccess(response) {
                        if (response.data.length > 0) {
                            var temp = $scope.eqDateGroup;
                            temp = temp.concat(response.data);
                            angular.copy(temp, $scope.eqDateGroup);
                            console.log($scope.eqDateGroup);
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.refreshListEQ2 = function(ofs) {
                    $http({
                        method : "GET",
                        url : "/mgmt/webgis/getDateEQ",
                        params : {offnum: ofs, ldt: eqdt}
                    }).then(function querySuccess(response) {
                        var result = response.data.map(function(el) {
                            var o = Object.assign({}, el);
                            $scope.eqDateGroup.filter(function(hsit) {
                                if (hsit.id == o.id) {
                                    if (hsit.check) {
                                        o.check = true;
                                    } else {
                                        o.check = false;
                                    }
                                }
                            });
                            return o;
                        })
                        angular.copy(result, $scope.eqDateGroup);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.getSensorType = function() {
                    $http({
                        method : "GET",
                        url : "/mgmt/webgis/getSensor"
                    }).then(function querySuccess(response) {
                        angular.copy(response.data, $scope.sensorGroup);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.dateCompare = function(targ) {
                    var ctime = new Date();
                    ctime.setHours(ctime.getHours() - 2);
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
                        targetEvent: ev,
                        locals:{dataToPass: modsel}
                    }).then(function(response){
                        $scope.predDateGroup.filter(function(hsit) {
                            mapService.removeHS('EQ_'+hsit.id);
                            mapService.removeHS('predTsu_'+hsit.id);
                            hsit.check = false;
                        });
                        modsel = response;
                        $scope.predDateGroup = [];
			            $scope.refreshListPred(0);
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.predItemCheck = function(tid_chk) {
                    $scope.predDateGroup.filter(function(hsit) {
                        if (hsit.id == tid_chk) {
                            if (hsit.check) {
                                console.log(tid_chk);
                                $http({
                                    method : "GET",
                                    url : "/mgmt/webgis/getPredTsu",
                                    params : {timid: tid_chk, modid: modsel}
                                }).then(function querySuccess(response) {
                                    if (response.data.features.length > 0) {
                                        mapService.drawHS('predTsu_'+tid_chk, response.data);
                                        $scope.eqForceItemCheck(tid_chk);
                                    }
                                }, function queryError(response) {
                                    console.log('connection failed');
                                });
                            } else {
                                console.log("close "+tid_chk);
                                mapService.removeHS('predTsu_'+tid_chk);
                                mapService.removeHS('EQ_'+tid_chk);
                            }
                        }
                    });
                }
                $scope.eqForceItemCheck = function(tid_chk) {
                    $http({
                        method : "GET",
                        url : "/mgmt/webgis/getEQ",
                        params : {timid: tid_chk}
                    }).then(function querySuccess(response) {
                        if (response.data.features.length > 0) {
                            mapService.drawHS('EQ_'+tid_chk, response.data);
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.eqItemCheck = function(tid_chk) {
                    console.log(tid_chk);
                    $scope.eqDateGroup.filter(function(hsit) {
                        if (hsit.id == tid_chk) {
                            if (hsit.check) {
                                console.log(tid_chk);
                                $http({
                                    method : "GET",
                                    url : "/mgmt/webgis/getEQ",
                                    params : {timid: tid_chk}
                                }).then(function querySuccess(response) {
                                    if (response.data.features.length > 0) {
                                        mapService.drawHS('EQ_'+tid_chk, response.data);
                                    }
                                }, function queryError(response) {
                                    console.log('connection failed');
                                });
                            } else {
                                console.log("close "+tid_chk);
                                mapService.removeHS('EQ_'+tid_chk);
                            }
                        }
                    });
                }
                $scope.sensorItemCheck = function(sensname, tid_chk, citem) {
                    const senstp = sensname.split('_')[0];
                    if (senslatest) {
                        sensdtm = new Date().toISOString();
                    }
                    $scope.sensorGroup.filter(function(hsit) {
                        if (hsit.id == tid_chk) {
                            if (hsit.check) {
                                console.log(tid_chk);
                                citem.loading = true;
                                $http({
                                    method : "GET",
                                    url : "/mgmt/webgis/getSensLoc",
                                    params : {timid: tid_chk, ltime: sensdtm}
                                }).then(function querySuccess(response) {
                                    if (response.data.features.length > 0) {
                                        mapService.drawHS(sensname+'_'+tid_chk, response.data);
                                    }
                                    citem.loading = false;
                                }, function queryError(response) {
                                    console.log('connection failed');
                                });
                            } else {
                                console.log("close "+tid_chk);
                                citem.loading = false;
                                mapService.removeHS(sensname+'_'+tid_chk);
                            }
                        }
                    });
                }
                function initTime() {
                    $timeout(function() {
                        const spl = sensdtm.split('T')[1].split('.')[0];
                        var options = {now: spl, twentyFour: true, showSeconds: true};
                        timepicker = $('.timepicker').wickedpicker(options);
                    }, 2000);
                }
                $scope.sensChooseTime = function(ev) {
                    $mdDialog.show({
                        scope: $scope,
                        templateUrl: 'dialog/sensorconfig/sensorconfig.template.html',
                        parent: angular.element(document.body),
                        multiple: true,
                        preserveScope: true,
                        escapeToClose: true,
                        clickOutsideToClose: true,
                        onComplete: initTime(),
                        targetEvent: ev
                    }).then(function(response){
                        console.log('add data');
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.eqChooseTime = function(ev) {
                    $mdDialog.show({
                        scope: $scope,
                        templateUrl: 'dialog/eqconfig/eqconfig.template.html',
                        parent: angular.element(document.body),
                        multiple: true,
                        preserveScope: true,
                        escapeToClose: true,
                        clickOutsideToClose: true,
                        targetEvent: ev
                    }).then(function(response){
                        console.log('add data');
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.tsuChooseTime = function(ev) {
                    $mdDialog.show({
                        scope: $scope,
                        templateUrl: 'dialog/tsuconfig/tsuconfig.template.html',
                        parent: angular.element(document.body),
                        multiple: true,
                        preserveScope: true,
                        escapeToClose: true,
                        clickOutsideToClose: true,
                        targetEvent: ev
                    }).then(function(response){
                        console.log('add data');
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.sensChangeTime = function(ttp) {
                    $mdDialog.hide('select');
                    if (ttp=='latest') {
                        sensdtm = new Date().toISOString();
                        senslatest = true;
                    }
                    else {
                        const dtonly = $scope.sensdate.toLocaleDateString('zh-Hans-CN');
                        console.log(dtonly);
                        var tmonly = timepicker.wickedpicker('time');
                        tmonly = tmonly.replace(/\s/g, '');
                        sensdtm = dtonly + 'T' + tmonly;
                        senslatest = false;
                    }
                    $scope.sensorGroup.filter(function(hsit) {
                        if (hsit.check) {
                            const sensname = hsit.name;
                            const tid_chk = hsit.id;
                            hsit.loading = true;
                            $http({
                                method : "GET",
                                url : "/mgmt/webgis/getSensLoc",
                                params : {timid: tid_chk, ltime: sensdtm}
                            }).then(function querySuccess(response) {
                                mapService.removeHS(sensname+'_'+tid_chk);
                                if (response.data.features.length > 0) {
                                    mapService.drawHS(sensname+'_'+tid_chk, response.data);
                                }
                                hsit.loading = false;
                            }, function queryError(response) {
                                console.log('connection failed');
                            });
                        }
                    });
                }
                $scope.eqChangeTime = function(ttp) {
                    $mdDialog.hide('select');
                    if (ttp=='all') {
                        eqdt = 'all';
                        $scope.eqdate = '';
                    }
                    else {
                        eqdt = $scope.eqdate.toLocaleDateString('zh-Hans-CN');
                    }
                    $scope.eqDateGroup.filter(function(hsit) {
                        mapService.removeHS('EQ_'+hsit.id);
                        hsit.check = false;
                    });
                    pagn2 = 0;
                    $scope.refreshListEQ2(0);
                }
                $scope.tsuChangeTime = function(ttp) {
                    $mdDialog.hide('select');
                    if (ttp=='all') {
                        tsudt = 'all';
                        $scope.tsudate = '';
                    }
                    else {
                        tsudt = $scope.tsudate.toLocaleDateString('zh-Hans-CN');
                    }
                    $scope.predDateGroup.filter(function(hsit) {
                        mapService.removeHS('EQ_'+hsit.id);
                        mapService.removeHS('predTsu_'+hsit.id);
                        hsit.check = false;
                    });
                    pagn2 = 1;
                    $scope.refreshListPred2(0);
                }
                $scope.refreshListPred(0);
                $scope.refreshListEQ(0);
                $scope.getSensorType();
                $interval(function() {$scope.refreshListPred2(0)}, 1000*180);
                $interval(function() {$scope.refreshListEQ2(0)}, 1000*180);
            }
});