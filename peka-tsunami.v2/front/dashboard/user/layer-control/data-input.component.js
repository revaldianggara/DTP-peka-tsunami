"use strict";

angular.module("layerControl").controller("dataInputCtrl", ["$scope", "$http", "$timeout", "$mdDialog", "$mdSidenav", "$mdToast", dataInputCtrl]);

function dataInputCtrl($scope, $http, $timeout, $mdDialog, $mdSidenav, $mdToast) {
  $timeout(function () {
    $mdSidenav("left").open();
  });
  const dt = new Date();
  const tyear = toString(dt.getFullYear());
  $scope.activeMenu = "datainput";
  $scope.loadingLog = false;
  $scope.activeFeature = "";
  $scope.features = [];
  var temp = {};
  var balarm = false;
  var sltid;
  const pgad = 30;
  var paglog = 0;

  $scope.loadInput = function () {
    $http({
      method: "GET",
      url: "/user/input/getFeatureType",
    }).then(
      function querySuccess(response) {
        var result = response.data.map(function (el) {
          var o = Object.assign({}, el);
          o.toggle = false;
          return o;
        });
        $scope.features = angular.copy(result);
        console.log($scope.features);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.loadInput();

  $scope.showinpsearchbar = function () {
    $scope.showinputsearch = !$scope.showinputsearch;
    if (!$scope.showinputsearch) {
      $scope.features = temp;
      $scope.featsearch = "";
    } else {
      temp = $scope.features;
      document.getElementById("searchbar").focus();
    }
  };

  $scope.searchInputFeature = function () {
    const regexp = new RegExp($scope.featsearch, "i");
    var res = $scope.features.filter((x) => regexp.test(x.name));
    $scope.features = res;
  };

  $scope.bottomData = function () {
    $scope.loadingLog = true;
    if (!balarm) {
      //run the event that was passed through
      balarm = true;
      $timeout(function () {
        if (balarm == true) {
          paglog += pgad;
          $scope.loadDetail(false, true);
          console.log("Hit the end");
          balarm = false;
        }
      }, 1000);
    }
  };
  $scope.loadDetail = function (itm, cond) {
    $scope.loadingLog = true;
    if (!cond) {
      paglog = 0;
      sltid = itm.id;
      $scope.activeFeature = itm.name;
    }
    $http({
      method: "GET",
      url: "/user/input/getFeatureDetail",
      params: {
        inpid: sltid,
        ofs: paglog,
      },
    }).then(
      function querySuccess(response) {
        if (cond) {
          var temp = $scope.dataft;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.dataft);
        } else {
          $scope.dataft = angular.copy(response.data);
        }
        $scope.loadingLog = false;
      },
      function queryError(response) {
        console.log("connection failed");
        $scope.loadingLog = false;
      }
    );
  };

  $scope.showAddNewInputDialog = function (ev) {
    $scope.hotspotselected = false;
    $mdDialog
      .show({
        controller: "addnewinputdialog",
        parent: angular.element(document.body),
        templateUrl: "dialog/addnewinput/addnewinput.template.html",
        targetEvent: ev,
        locals: {
          dataToPass: $scope.features,
        },
      })
      .then(function (response) {
        console.log("add data");
        $scope.loadInput();
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
        $scope.loadInput();
      });
  };

  $scope.downloadTemplate = function () {
    $http({
      method: "GET",
      url: "/user/input/getDownloadTemp",
    }).then(
      function querySuccess(response) {
        var blob = new Blob([response.data], {
          type: "text/csv",
        });
        saveAs(blob, "template.csv");
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.deleteFeature = function (ev, iditm) {
    var confirm = $mdDialog.confirm().title("Menghapus Input Fitur").textContent("Apakah anda yakin untuk menghapus fitur?").targetEvent(ev).ok("Ya").cancel("Tidak");
    $mdDialog.show(confirm).then(
      function () {
        $http({
          method: "GET",
          url: "/user/input/getDeleteFeature",
          params: {
            idf: iditm.id,
          },
        }).then(
          function querySuccess(response) {
            $scope.loadInput();
            $mdToast
              .show(
                $mdToast
                .simple()
                .textContent("Feature " + iditm.name + " berhasil dihapus!")
                .position("top right")
                .hideDelay(5000)
              )
              .then(function () {
                console.log("Toast dismissed.");
              })
              .catch(function () {
                console.log("Toast failed or was forced to close early by another toast.");
              });
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      },
      function () {
        console.log("cancel delete");
      }
    );
  };
}