'use strict';

angular
    .module('layerControl')
    .component('layerControl', {
        templateUrl: 'layer-control/layer-control.template.html',
        controller:
            function layercontrolController($scope, $http, $mdSidenav, mapService, $interval) {
                $scope.hs = mapService.info_detail;
                var eqar = [];
                $scope.closesidenav = function() {
                    $mdSidenav('right').close();
                }
                $scope.predItemCheck = function(eqid) {
                    $http({
                        method : "GET",
                        url : "/getLastTsu",
                        params : {eq_id: eqid}
                    }).then(function querySuccess(response) {
                        if (response.data.features) {
                            mapService.drawHS('predTsu_'+eqid, response.data);
                            $mdSidenav('right').open();
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.getLocTsu = function(eqid) {
                    $http({
                        method : "GET",
                        url : "/getTsuLoc",
                        params : {eq_id: eqid}
                    }).then(function querySuccess(response) {
                        $scope.areatsunami = response.data;
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.eqItemCheck = function() {
                    $http({
                        method : "GET",
                        url : "/getLastEQ"
                    }).then(function querySuccess(response) {
                        if (response.data.features) {
                            const neqar = response.data.features;
                            const toadd = neqar.filter(({ id: id1 }) => !eqar.some(({ id: id2 }) => id2 === id1));
                            const todel = eqar.filter(({ id: id1 }) => !neqar.some(({ id: id2 }) => id2 === id1));
                            eqar = neqar;
                            toadd.map(function (el) {
                                var ngjson = {};
                                ngjson.type = 'FeatureCollection';
                                ngjson.features = [];
                                ngjson.features.push(el);
                                mapService.drawHS('EQ_'+el.id, ngjson);
                                $scope.predItemCheck(el.id);
                                $scope.getLocTsu(el.id);
                            });
                            todel.map(function (el) { 
                                mapService.removeHS('EQ_'+el.id);
                                mapService.removeHS('predTsu_'+el.id);
                            });
                        }
                        else {
                            mapService.clearMap();
                            $scope.areatsunami = [];
                        }
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }
                $scope.eqItemCheck();
                $interval(function() {$scope.eqItemCheck()}, 1000*30);
            }
});