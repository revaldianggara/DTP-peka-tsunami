'use strict';

angular.
    module('changemodel').
    controller('changemodeldialog', ['$scope', '$mdDialog', '$timeout','$http', 'dataToPass', changemodeldialog]);
        function changemodeldialog($scope, $mdDialog, $timeout, $http, dataToPass) {
            $scope.activeModel = dataToPass;
            $scope.idslctd = false;
            var idsel = 0;
            $scope.cancelSelectModel = function() {
                $mdDialog.cancel('cancel');
            }
            $scope.getModel = function() {
                $http({
                    method : "GET",
                    url : "/user/webgis/getModels"
                }).then(function querySuccess(response) {
                    $scope.models = angular.copy(response.data);
                }, function queryError(response) {
                    console.log('connection failed');
                });
            }
            $scope.makeDefault = function() {
                $http({
                    method : "GET",
                    url : "/mgmt/webgis/getMakeDefault",
                    params : {idef: idsel}
                }).then(function querySuccess(response) {
                    $mdDialog.hide(idsel);
                }, function queryError(response) {
                    console.log('connection failed');
                });
            }
            $scope.displayModel = function() {
                $mdDialog.hide(idsel);
            }
            $scope.selectMod = function(idl) {
                idsel = idl;
                $scope.activeModel = idl;
                $scope.idslctd = true;
            }
            $scope.getModel();
        }
