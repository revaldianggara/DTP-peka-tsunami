"use strict";

angular.module("layerControl").controller("modelmlCtrl", ["$scope", "$http", "$mdDialog", "$interval", modelmlCtrl]);

function modelmlCtrl($scope, $http, $mdDialog, $interval) {
  var hwst = "";
  $scope.activeMenu = "dashboard";
  $scope.loadingLog = false;
  $scope.activeModel = "";
  $scope.modelStatus = "";
  $scope.modelLevel = "";
  $scope.features = [];
  $scope.showmodelsearch = true;
  var temp = {};
  $scope.searchkeywords = ''

  $scope.showinpsearchbar = function () {
    $scope.showmodelsearch = !$scope.showmodelsearch;
    if (!$scope.showmodelsearch) {
      $scope.models = temp;
      $scope.featsearchMod = "";
    } else {
      temp = $scope.models;
      document.getElementById("searchbar").focus();
    }
  }

  $scope.searchInputModel = function () {
    const regexp = new RegExp($scope.featsearchMod, 'i');
    var res = $scope.models.filter(x => regexp.test(x.name));
    $scope.models = res;
  }

  $scope.loadHwStats = function () {
    $http({
      method: "GET",
      url: "/user/getHWStats"
    }).then(
      function querySuccess(response) {
        var hw = angular.copy(response.data)
        var gputil_val = [hw[2].tags[0].val.replace("%", "")]; //utilization value
        var gputil = [hw[2].tags[0].val]; //utilization persentase
        var ram_val = [hw[2].tags[17].val.replace("%", "")]; //RAM value
        var ram = [hw[2].tags[17].val]; //RAM
        $scope.gpu = gputil_val.concat(gputil);
        $scope.ram = ram_val.concat(ram);
      },
      function queryError(response) {
        console.log("connection failed")
      }
    );
  };
  $scope.loadHwStats();

  $scope.logHWStats = function () {
    loadHWSt();
    reloadHW = $interval(function () {
      loadHWSt();
    }, 60000);
  }

  $scope.loadModel = function () {
    $http({
      method: "GET",
      url: "/user/model/getModels",
    }).then(
      function querySuccess(response) {
        var result = response.data.map(function (el) {
          var o = Object.assign({}, el);
          o.toggle = false;
          return o;
        });
        $scope.models = angular.copy(result);
        console.log($scope.models);

      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
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
  $scope.loadModel();
  $scope.loadModDetail = function (itm) {
    console.log(itm.id);
    $scope.activeModelId = itm.id;
    $scope.activeModel = itm.name;
    $scope.modelStatus = itm.status;
    $scope.modelLevel = itm.level;
    $scope.models.map(function (el, index) {
      var o = Object.assign({}, el);
      console.log(o.id);
      if (o.id != itm.id) {
        $scope.models[index].toggle = false;
      } else {
        itm.toggle = !itm.toggle;
      }
    });

    $http({
      method: "GET",
      url: "/user/model/getStreamLog",
      params: {
        modid: itm.id,
      },
    }).then(
      function querySuccess(response) {
        $scope.logText = angular.copy(response.data);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );

    function _arrayBufferToBase64(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    }

    $http({
      method: "GET",
      url: "/user/model/getLogAcc",
      params: {
        modid: itm.id,
      },
      responseType: 'arraybuffer'
    }).then(
      function querySuccess(response) {
        $scope.imgAcc = _arrayBufferToBase64(response.data);
      },
      function queryError(response) {
        console.log("connection failed")
      });

    $http({
      method: "GET",
      url: "/user/model/getLogLoss",
      params: {
        modid: itm.id,
      },
      responseType: 'arraybuffer'
    }).then(
      function querySuccess(response) {
        $scope.imgLoss = _arrayBufferToBase64(response.data);
      },
      function queryError(response) {
        console.log("connection failed")
      });
  };

  $scope.editModel = function (ev, edi) {
    console.log(edi);
    $mdDialog
      .show({
        controller: "editdialog",
        parent: angular.element(document.body),
        templateUrl: "dialog/editdialog/editdialog.template.html",
        targetEvent: ev,
        locals: {
          dataToPass: edi,
        },
      })
      .then(function (response) {
        console.log("add data");
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.runModel = function (mid) {
    $http({
      method: "GET",
      url: "/user/model/getRunModel",
      params: {
        idm: mid,
      },
    }).then(
      function querySuccess(response) {
        $scope.loadModel();
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.pauseModel = function (mid) {
    $http({
      method: "GET",
      url: "/user/model/getPausePred",
      params: {
        idm: mid,
      },
    }).then(
      function querySuccess(response) {
        $scope.loadModel();
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.playModel = function (mid) {
    $http({
      method: "GET",
      url: "/user/model/getPlayPred",
      params: {
        idm: mid,
      },
    }).then(
      function querySuccess(response) {
        $scope.loadModel();
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.cancelModel = function (ev, mid) {
    var confirm = $mdDialog.confirm().title("Membatalkan Proses Training").textContent("Apakah anda yakin untuk membatalkan proses training?").targetEvent(ev).ok("Ya").cancel("Tidak");
    $mdDialog.show(confirm).then(
      function () {
        $http({
          method: "GET",
          url: "/user/model/getCancelModel",
          params: {
            idm: mid,
          },
        }).then(
          function querySuccess(response) {
            $scope.loadModel();
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      },
      function () {
        console.log("cancel cancel");
      }
    );
  };

  $scope.deleteModel = function (ev, mid) {
    var confirm = $mdDialog.confirm().title("Menghapus Model").textContent("Apakah anda yakin untuk menghapus model").targetEvent(ev).ok("Ya").cancel("Tidak");
    $mdDialog.show(confirm).then(
      function () {
        $http({
          method: "GET",
          url: "/user/model/getDeleteModel",
          params: {
            idm: mid,
          },
        }).then(
          function querySuccess(response) {
            $scope.loadModel();
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

  $scope.showAddNewModelDialog = function (ev) {
    $mdDialog
      .show({
        controller: "addnewmodeldialog",
        parent: angular.element(document.body),
        templateUrl: "dialog/addnewmodel/addnewmodel.template.html",
        targetEvent: ev,
        multiple: true,
        locals: {
          dataToPass: $scope.features,
        },
      })
      .then(function (response) {
        $scope.loadModel();
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
}