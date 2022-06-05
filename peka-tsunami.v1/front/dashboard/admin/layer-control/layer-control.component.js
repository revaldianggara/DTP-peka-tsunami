'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope, $http, $interval, $timeout, $mdDialog) {
                const dt = new Date();
                const tyear = toString(dt.getFullYear());
                $scope.activeMenu = 'user';
                $scope.activeFeature = '';
                $scope.features = [];
                $scope.hwst = {};
                $scope.loadingLog = false;
                var falarm = false;
                const pgad = 30;
                var paglog = 0;
                var reloadHW = undefined;
                $scope.loadUser = function() {
                    if (angular.isDefined(reloadHW)) {
                        $interval.cancel(reloadHW);
                        reloadHW = undefined;
                    }
                    $http({
                        method : "GET",
                        url : "/admin/users/getUsers"
                    }).then(function querySuccess(response) {
                        $scope.users = angular.copy(response.data);
                        console.log($scope.users);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.removeUser = function(usrid, ev) {
                    var confirm = $mdDialog.confirm()
                            .title('Menghapus Pengguna')
                            .textContent('Apakah anda yakin untuk menghapus pengguna?')
                            .targetEvent(ev)
                            .ok('Ya')
                            .cancel('Tidak');
                    $mdDialog.show(confirm).then(function () {
                        $http({
                            method : "GET",
                            url : "/admin/users/getDeleteUser",
                            params : {userid: usrid}
                        }).then(function querySuccess(response) {
                            $scope.loadUser();
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }, function () {
                        console.log('cancel delete');
                    });
                }
                $scope.showAddUser = function(ev) {
                    $mdDialog.show({
                        controller: 'addnewuserdialog',
                        parent: angular.element(document.body),
                        templateUrl: 'dialog/adduser/adduser.template.html',
                        targetEvent: ev
                    }).then(function(response){
                        console.log('add data');
                        $scope.loadUser();
                    })
                    .catch(function(responseIfRejected){
                        console.log('cancel');
                    });
                }
                $scope.bottomLog = function() {
                    $scope.loadingLog = true;
                    if (!falarm) {
                        //run the event that was passed through
                        falarm = true;
                        $timeout(function () {
                            if (falarm==true) {
                                paglog += pgad;
                                $scope.logSelected(true);
                                console.log("Hit the end");
                                falarm = false;
                            }
                        }, 500);
                    }
                }
                $scope.logSelected = function(cond) {
                    if (!cond) {
                        paglog = 0;
                    }
                    if (angular.isDefined(reloadHW)) {
                        $interval.cancel(reloadHW);
                        reloadHW = undefined;
                    }
                    $http({
                        method : "GET",
                        url : "/admin/process/getProcessLog",
                        params : {logid: $scope.selectedLog+1, ofs: paglog}
                    }).then(function querySuccess(response) {
                        if (cond) {
                            var temp = $scope.datacq;
                            temp = temp.concat(response.data);
                            angular.copy(temp, $scope.datacq);
                        }
                        else {
                            $scope.datacq = angular.copy(response.data);
                        }
                        $scope.loadingLog = false;
                    }, function queryError(response) {
                        console.log('connection failed');
                        $scope.loadingLog = false;
                    });
                }
                function loadHWSt() {
                    console.log('reloaded');
                    $http({
                        method : "GET",
                        url : "/admin/hw/getHWStats"
                    }).then(function querySuccess(response) {
                        $scope.hwst = angular.copy(response.data);
                        console.log($scope.hwst);
                        console.log($scope.hwst[0].tags);
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.logHWStats = function() {
                    loadHWSt();
                    reloadHW = $interval(function() {
                        loadHWSt();
                    }, 60000);
                }
                $scope.loadUser();
            }
});
