'use strict';

angular.module('layerControl')
    .controller('tablePenggunaCtrl', ['$scope', '$filter', '$mdDialog', '$http', tablePenggunaCtrl]);

function tablePenggunaCtrl($scope, $filter, $mdDialog, $http) {

    $scope.loadUser = function () {
        var init;
        console.log('reloaded data user');
        $http({
            method: "GET",
            url: "/admin/users/getUsers"
        }).then(function querySuccess(response) {
            $scope.users = angular.copy(response.data);
            console.log($scope.users);

            // search pagination
            $scope.searchKeywords = '';
            $scope.filteredPengguna = [];
            $scope.row = '';
            $scope.select = function (page) {
                var end, start;
                start = (page - 1) * $scope.numPerPage;
                end = start + $scope.numPerPage;
                return $scope.currentPagePengguna = $scope.filteredPengguna.slice(start, end);
            };
            $scope.onFilterChange = function () {
                $scope.select(1);
                $scope.currentPage = 1;
                return $scope.row = '';
            };
            $scope.onNumPerPageChange = function () {
                $scope.select(1);
                return $scope.currentPage = 1;
            };
            $scope.onOrderChange = function () {
                $scope.select(1);
                return $scope.currentPage = 1;
            };
            $scope.search = function () {
                $scope.filteredPengguna = $filter('filter')($scope.users, $scope.searchKeywords);
                return $scope.onFilterChange();
            };
            $scope.order = function (rowName) {
                if ($scope.row === rowName) {
                    return;
                }
                $scope.row = rowName;
                $scope.filteredPengguna = $filter('orderBy')($scope.users, rowName);
                return $scope.onOrderChange();
            };

            $scope.numPerPageOpt = [5, 10, 20];
            $scope.numPerPage = $scope.numPerPageOpt[2];
            $scope.currentPage = 1;
            $scope.currentPagePengguna = [];

            init = function () {
                $scope.search();
                return $scope.select($scope.currentPage);
            };

            init();

        }, function queryError(response) {
            console.log('connection failed');
        });
    }

    $scope.removeUser = function (usrid, ev) {
        var confirm = $mdDialog.confirm()
            .title('Menghapus Pengguna')
            .textContent('Apakah anda yakin untuk menghapus pengguna?')
            .targetEvent(ev)
            .ok('Ya')
            .cancel('Tidak');
        $mdDialog.show(confirm).then(function () {
            $http({
                method: "GET",
                url: "/admin/users/getDeleteUser",
                params: {
                    userid: usrid
                }
            }).then(function querySuccess(response) {
                $scope.loadUser();
            }, function queryError(response) {
                console.log('connection failed');
            });
        }, function () {
            console.log('cancel delete');
        });
    }

    $scope.showAddUser = function (ev) {
        $mdDialog.show({
                controller: 'addnewuserdialog',
                parent: angular.element(document.body),
                templateUrl: 'dialog/adduser/adduser.template.html',
                targetEvent: ev
            }).then(function (response) {
                console.log('add data');
                $scope.loadUser();
            })
            .catch(function (responseIfRejected) {
                console.log('cancel');
            });
    };

    $scope.showEditUser = function (ev) {
        $mdDialog.show({
                controller: 'addnewuserdialog',
                parent: angular.element(document.body),
                templateUrl: 'dialog/edituser/edituser.template.html',
                targetEvent: ev
            }).then(function (response) {
                console.log('add data');
                $scope.loadUser();
            })
            .catch(function (responseIfRejected) {
                console.log('cancel');
            });
    };
    $scope.loadUser();
}