"use strict";


angular.module("layerControl").controller("simulasiCtrl", ["$scope", "$http", "$mdSidenav", "$timeout", "FileUploader", "$mdDialog", "$mdToast", "$interval", "mapService_simulasi",
  simulasiCtrl
]);

function simulasiCtrl($scope, $http, $mdSidenav, $timeout, FileUploader, $mdDialog, $mdToast, $interval, mapService_simulasi) {
  $scope.uploadingSimulasi = false;
  $scope.btnUpload = true;
  $scope.inputsimulasi = [];
  $scope.progresUpload = false
  $scope.regselectinfo = false;
  $scope.idsinfo = false;
  $scope.maginfo = false;
  // $scope.lonSinfo = "...";
  // $scope.latSinfo = "...";
  // $scope.maginfod = "...";
  // $scope.depth = "...";
  // $scope.dev12info = "...";
  // $scope.dev27info = "...";
  // $scope.dev62info = "...";
  // $scope.dev187info = "...";
  // $scope.jrk_trsinfo = "...";
  // $scope.jrk_pthinfo = "...";
  // $scope.IDTinfo = "...";
  // $scope.lonTinfo = "...";
  // $scope.latTinfo = "...";
  // $scope.elevinfo = "...";
  // $scope.sshinfo = "...";
  // $scope.etainfo = "...";
  // $scope.predsshinfo = "...";
  // $scope.predetainfo = "...";
  // $scope.bedasshinfo = "...";
  // $scope.bedaetainfo = "...";
  // $scope.ketinfo = "...";

  $scope.source = mapService_simulasi.info_sumber;
  $scope.target = mapService_simulasi.info_target;

  $scope.showData = function () {
    $scope.visibleData = $scope.visibleData ? false : true;
  };
  $scope.close = function () {
    $scope.visibleData = $scope.visibleData ? false : true;
  };
  $scope.closeDetail = function () {
    $mdSidenav("right").close();
  };
  $timeout(function () {
    $mdSidenav("left").open();
  });

  $scope.loadRegion = function () {
    $http({
      method: "GET",
      url: "/user/simulasi/getRegion",
    }).then(
      function querySuccess(response) {
        $scope.regions = angular.copy(response.data);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.getRegName = function () {
    $http({
      method: "GET",
      url: "/user/simulasi/getRegName",
      params: {
        reg_id: $scope.regidSelect,
      }
    }).then(
      function querySuccess(response) {
        $scope.region_select = angular.copy(response.data[0].nama);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.getSourceList = function () {
    $http({
      method: "GET",
      url: "/user/simulasi/getSourceList",
      // source id = value dari dropdown pilih region
      params: {
        reg_id: $scope.regidSelect,
      },
    }).then(
      function querySuccess(response) {
        console.log(response.data)
        $scope.regselectinfo = true;
        $scope.idsinfo = true;
        $scope.maginfo = true;
        // select sid
        $scope.slsid = angular.copy(response.data[1].id_s);
        console.log('id source', $scope.slsid)
        // select tid
        $scope.sltid = angular.copy(response.data[1].id);
        console.log('id target', $scope.sltid)
        // select mag
        $scope.slmag = angular.copy(response.data[1].mag);
        $scope.getRegName();
        $scope.getSourceLoc();
        $scope.getTargetLoc();

        $interval(function () {
          $scope.getTargetList();
        }, 1000, 3, true);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.getSourceLoc = function () {
    $http({
      method: "GET",
      url: "/user/simulasi/getSourceLoc",
      params: {
        source_id: $scope.sltid,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.features && response.data.features.length > 0) {
          mapService_simulasi.drawSource("Sumber", response.data);
        } else {
          console.log("No Data Found");
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.getTargetList = function () {
    $http({
      method: "GET",
      url: "/user/simulasi/getTargetList",
      params: {
        source_id: $scope.sltid,
      },
    }).then(
      function querySuccess(response) {
        $scope.targetlist = angular.copy(response.data);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.getTargetLoc = function () {
    $http({
      method: "GET",
      url: "/user/simulasi/getTargetLoc",
      params: {
        source_id: $scope.sltid,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.features && response.data.features.length > 0) {
          mapService_simulasi.drawTarget("Target", response.data);
        } else {
          console.log("No Data Found");
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.addNewSimulasiName = function (ev) {
    var confirm = $mdDialog.prompt().title("Nama Simulasi").targetEvent(ev).required(true).multiple(true).ok("Add New Simulasi Name").cancel("Cancel");
    $mdDialog.show(confirm).then(
      function (result) {
        $http({
          method: "GET",
          url: "/user/simulasi/getNewRegion",
          params: {
            nof: result,
          },
        }).then(
          function querySuccess(response) {
            console.log("add simulasi success");
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      },
      function () {
        console.log("cancelled");
      }
    );
  };

  $scope.deleteSimulasi = function (ev, sid) {
    sid = $scope.pilihsimulasi
    console.log(sid)
    var confirm = $mdDialog.confirm().title("Menghapus Simulasi").textContent("Apakah anda yakin untuk menghapus simulasi").targetEvent(ev).ok("Ya").cancel("Tidak");
    $mdDialog.show(confirm).then(
      function () {
        $http({
          method: "GET",
          url: "/user/simulasi/getDeleteSimulasi",
          params: {
            ids: sid.id,
          },
        }).then(
          function querySuccess(response) {
            $scope.loadRegion();
            $mdToast
              .show(
                $mdToast
                .simple()
                .textContent("Simulasi " + sid.id + " berhasil dihapus!")
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

  $scope.inputsimulasi = [];
  var uploader = $scope.uploader = new FileUploader({
    url: "/user/simulasi/getUploadParseCSV",
    method: "POST"
  });

  $scope.addSimulasi = function () {
    $scope.uploadingSimulasi = true;
    $timeout(function () {
      // var file = document.getElementById("fileCSV").files[0];
      // var dataSimul = [];
      // Papa.parse(file, {
      //   download: true,
      //   header: true,
      //   skipEmptyLines: true,
      //   error: function (err, file, inputElem, reason) {},
      //   complete: function (results) {
      //     dataSimul.push(results.data);
      //     console.log(results.data)
      //   }
      // });
    }, 1000);
    uploader.uploadAll();
  }


  $scope.itemSelected = function () {
    console.log("file selected");
  };
  uploader.onProgressItem = function (fileItem, progress) {
    console.log("onProgressItem", fileItem, progress);
    $scope.btnUpload = false;
    $timeout(function () {
      $scope.uploadingSimulasi = true;
    }, 2000)
  };
  uploader.onSuccessItem = function (fileItem, response, status, headers) {
    console.log("onSuccessItem", fileItem, response, status, headers);
    $timeout(function () {
      $scope.btnUpload = true;
      $scope.uploadingSimulasi = false;
      document.getElementById("fileCSV").value = "";
      $mdToast
        .show(
          $mdToast
          .simple()
          .textContent("Simulasi Region " + $scope.inputsimulasi.id + " Berhasil Ditambahkan!")
          .position("top right")
          .hideDelay(5000)
        )
        .then(function () {
          console.log("Toast dismissed.");
        })
        .catch(function () {
          console.log("Toast failed or was forced to close early by another toast.");
        });
    }, 3000);
  };
  uploader.onBeforeUploadItem = function (item) {
    item.formData = [{
      reg_id: $scope.inputsimulasi.id,
    }, ];
    console.log(item.formData);
  };

  $scope.addNewSimul = function (ev) {
    var confirm = $mdDialog.prompt().title("Nama Simulasi").targetEvent(ev).required(true).multiple(true).ok("Tambah Simulasi Baru").cancel("Cancel");
    $mdDialog.show(confirm).then(
      function (region) {
        $http({
          method: "GET",
          url: "/user/simulasi/getNewSimulasi",
          params: {
            regname: region,
          },
        }).then(
          function querySuccess(response) {
            $mdToast
              .show(
                $mdToast
                .simple()
                .textContent("Simulasi " + region + " berhasil ditambahkan!")
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
        console.log("cancelled");
      }
    );
  };
}