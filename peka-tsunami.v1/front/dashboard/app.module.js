'use strict';

angular.module('loginpage', ['ngMaterial', 'ngMessages'])
.controller('loginController', ['$scope', '$window', '$http', function($scope, $window, $http) {
    $scope.login = [];
    $scope.wrongup = false;
    $scope.submit = function() {
        if($scope.login.name.length!=0 || !$scope.login.password.length!=0) {
            $http({
                method : "GET",
                url : "/login",
                params : {user: $scope.login.name, pass: $scope.login.password}
            }).then(function querySuccess(response) {
                if (response.data) {
                    if (response.data.level!=undefined) {
                        console.log(response.data.level);
                        if (response.data.level == 'scientist') {
                            $window.location.href = '/dashboard/user/index';
                        }
                        else if (response.data.level == 'admin'){
                            $window.location.href = '/dashboard/admin/index';
                        }
                        else if (response.data.level == 'management'){
                            $window.location.href = '/dashboard/mgmt/index';
                        }
                        else if (response.data.level == 'verifikator'){
                            $window.location.href = '/dashboard/verif/index';
                        }
                    }
                    else {
                        console.log('wrong');
                        $scope.wrongup = true;
                    }
                }
                else {
                    console.log('wrong');
                    $scope.wrongup = true;
                }
            }, function queryError(response) {
                console.log('connection failed');
            });
        }
    }
    $http({
        method : "GET",
        url : "/check",
        params : {user: $scope.login.name, pass: $scope.login.password}
    }).then(function querySuccess(response) {
        if (response.data != 'false') {
            if (response.data.level!=undefined) {
                console.log(response.data.level);
                if (response.data.level == 'scientist') {
                    $window.location.href = '/dashboard/user/index';
                }
                else if (response.data.level == 'admin'){
                    $window.location.href = '/dashboard/admin/index';
                }
                else if (response.data.level == 'management'){
                    $window.location.href = '/dashboard/mgmt/index';
                }
                else if (response.data.level == 'verifikator'){
                    $window.location.href = '/dashboard/verif/index';
                }
            }
        }
        else {
            console.log('wrong');
        }
    }, function queryError(response) {
        console.log('connection failed');
    });
}]);
