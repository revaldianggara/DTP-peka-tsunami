'use strict';

angular.
module('addnewuser').
controller('edituserdialog', ['$scope', '$mdDialog', '$http', edituserdialog]);

function edituserdialog($scope, $mdDialog, $http) {
    $scope.userinfo = {};

    $scope.cancelAddUser = function () {
        $mdDialog.cancel('cancel');
    }

    $scope.editUser = function () {
        return $http({
            method: "GET",
            url: "/admin/users/getEditUser",
            params: {
                user: $scope.userinfo.user,
                level: $scope.userinfo.level,
                tgl_create: $scope.userinfo.tgl_create,
                email: $scope.userinfo.email
            }
        }).then(function querySuccess(response) {
            $uibModalInstance.close($scope.userinfo);
        }, function queryError(response) {
            console.log('connection failed');
        });
    }
}