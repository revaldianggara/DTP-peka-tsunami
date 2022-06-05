'use strict';

angular.
module('addnewuser').
controller('addnewuserdialog', ['$scope', '$mdDialog', '$http', addnewuserdialog]);

function addnewuserdialog($scope, $mdDialog, $http) {
    $scope.userinfo = {};

    $scope.adduser = function () {
        return $http({
            method: "GET",
            url: "/admin/users/getAddUser",
            params: {
                user: $scope.userinfo.user,
                pass: $scope.userinfo.pass,
                level: $scope.userinfo.level,
                email: $scope.userinfo.email,
            }
        }).then(function querySuccess(response) {
            $mdDialog.hide('added');
        }, function queryError(response) {
            console.log('connection failed');
        });
    }

    $scope.cancelAddUser = function () {
        $mdDialog.cancel('cancel');
    }
}