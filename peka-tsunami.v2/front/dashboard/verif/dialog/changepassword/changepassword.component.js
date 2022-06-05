'use strict';

angular.
module('changepassword').
controller('changepassworddialog', ['$scope', '$mdDialog', '$http', changepassworddialog]);

function changepassworddialog($scope, $mdDialog, $http) {
    $scope.userinfo = {};
    $scope.cancelChange = function () {
        $mdDialog.cancel('cancel');
    }
    $scope.changepassword = function () {
        return $http({
            method: "GET",
            url: "/verif/changePassword",
            params: {
                opass: $scope.userinfo.oldpass,
                npass: $scope.userinfo.newpass
            }
        }).then(function querySuccess(response) {
            if (response.data == 'false') {
                alert("Change password failed!");
            }
            $mdDialog.hide('changed');
        }, function queryError(response) {
            alert("Change password failed!");
        });
    }
}