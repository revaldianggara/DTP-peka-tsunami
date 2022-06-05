'use strict';

angular.
    module('addnewinput').
    controller('addnewinputdialog', ['$scope', '$mdDialog', '$http', '$timeout', 'FileUploader', 'dataToPass', addnewinputdialog]);
        function addnewinputdialog($scope, $mdDialog, $http, $timeout, FileUploader, dataToPass) {
            $scope.dyear = [];
            $scope.dperiod = [];
            $scope.inputfeature = [];
            $scope.uploadingInput = false;
            $scope.fileSelected = false;
            $scope.cancelAddInputFeature = function() {
                $mdDialog.cancel('cancel');
            }
            const d = new Date();
            const cyr = d.getFullYear();
            for (var y=2000; y<=cyr; y++) {
                const nyr = {'name': String(y)};
                $scope.dyear.unshift(nyr) ;
            }
            for (var dp=1; dp<=46; dp++) {
                const nyr = {'name': String(dp)};
                $scope.dperiod.unshift(nyr) ;
            }
            $scope.loadFeature = function() {
                return $http({
                    method : "GET",
                    url : "/user/input/getFeatureType"
                }).then(function querySuccess(response) {
                    $scope.features = response.data;
                }, function queryError(response) {
                    console.log('connection failed');
                });
            }
            $scope.addNewInputFeatureName = function(ev) {
                var confirm = $mdDialog.prompt()
                    .title('Feature Name')
                    .targetEvent(ev)
                    .required(true)
                    .multiple(true)
                    .ok('Add New Feature Name')
                    .cancel('Cancel');

                $mdDialog.show(confirm).then(function (result) {
                    //const addin = {id: 9999, name:result, status: 'checking', toggle: false};
                    //$scope.features.unshift(addin);
                    $http({
                        method : "GET",
                        url : "/user/input/getNewFeature",
                        params : {nof: result}
                    }).then(function querySuccess(response) {
                        console.log('add feature success');
                    }, function queryError(response) {
                        console.log('connection failed');
                    });
                }, function () {
                    console.log('cancelled');
                });
            }
            var uploader = $scope.uploader = new FileUploader({
                url: 'input/getUploadFeature',
                method: 'POST'
            });
            $scope.addNewInput = function() {
                uploader.uploadAll();
            }
            $scope.itemSelected = function() {
                console.log('file selected');
            }
            uploader.onProgressItem = function(fileItem, progress) {
                console.log('onProgressItem', fileItem, progress);
                $scope.uploadingInput = true;
            };
            uploader.onSuccessItem = function(fileItem, response, status, headers) {
                console.log('onSuccessItem', fileItem, response, status, headers);
                $scope.uploadingInput = false;
                $mdDialog.cancel('cancel');
            };
            uploader.onBeforeUploadItem = function (item) {
                item.formData = [{
                    nof: $scope.inputfeature.name,
                    fyear: $scope.inputfeature.year,
                    fperiod: $scope.inputfeature.period
                }];
                console.log(item.formData);
            };
        }