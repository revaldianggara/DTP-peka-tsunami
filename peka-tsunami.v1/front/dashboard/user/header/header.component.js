'use strict';

angular.
    module('header').
    component('header', {
        templateUrl: 'header/header.template.html',
        controller: function headerController($scope, $http, $window, $mdSidenav, $mdDialog) {
            $scope.showUserMenu = function($mdMenu, ev) {
                $mdMenu.open(ev);
            }
            $scope.logout = function() {
                $http({
                    method : "GET",
                    url : "/logout"
                }).then(function querySuccess(response) {
                    console.log('logged out');
                    $window.location.href = '../..';
                }, function queryError(response) {
                    console.log('connection failed');
                });
            }
            $scope.changePass = function(ev) {
                $mdDialog.show({
                    controller: 'changepassworddialog',
                    parent: angular.element(document.body),
                    templateUrl: 'dialog/changepassword/changepassword.template.html',
                    targetEvent: ev
                }).then(function(response){
                    console.log('changed');
                })
                .catch(function(responseIfRejected){
                    console.log('cancel');
                });
            }
            $scope.hideMenu = function() {
                $mdSidenav('left').toggle();
            }
        }
});
