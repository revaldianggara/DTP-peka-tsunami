"use strict";

angular.module("layerControl").controller("dashboardCtrl", ["$scope", "$http", "$mdSidenav", "$timeout", "mapService_dashboard", "$mdDialog", "$interval", dashboardCtrl]);

function dashboardCtrl($scope, $http, $mdSidenav, $timeout, mapService_dashboard, $mdDialog, $interval) {
  // webgis
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
  $("#chartarea").hide();
  $scope.toggle = {};
  var falarm1 = false;
  var falarm2 = false;
  var modsel = 0;
  const pgad = 10;
  var pagn1 = 0;
  var pagn2 = 0;
  var sensdtm = new Date().toISOString();
  var eqdt = "all";
  var tsudt = "all";
  var timepicker;
  var senslatest = true;
  $scope.line = "line";
  $scope.bar = "bar";
  $scope.toggle.list1 = true;
  $scope.predDateGroup = [];
  $scope.eqDateGroup = [];
  $scope.sensorGroup = [];
  $scope.hs = mapService_dashboard.info_detail;
  $scope.cancelChangeTime = function () {
    $mdDialog.cancel("cancel");
  };

  // Chart Dynamic
  $scope.dataEqMonth = [];
  $scope.dataEqMag = [];
  $scope.labels_EqMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Ags",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  $scope.labels_EqMag = [1, 2, 3, 4, 5, 6, 7, 8];

  var nmag = 8;
  var nmonth = 12;
  var dmag = [];
  var dmonth = [];

  for (var i = 0; i < nmag; i++) {
    var c = "0";
    dmag.push(c);
  }

  for (var i = 0; i < nmonth; i++) {
    var c = "0";
    dmonth.push(c);
  }

  // calendar
  $scope.formats = ["yyyy"];
  $scope.format = $scope.formats[0];

  $scope.popup = {
    openedEqMonth: false,
    openedEqYear: false,
  };


  $scope.openEqMonth = function ($event) {
    $scope.popup.openedEqMonth = true;
  };

  $scope.openEqYear = function ($event) {
    $scope.popup.openedEqYear = true;
  }

  $scope.lastEqOnMonth = function () {
    var now = new Date().getFullYear();
    var dmonth = [];
    for (var i = 0; i < nmonth; i++) {
      var c = "0";
      dmonth.push(c);
    }
    $http({
      method: "GET",
      url: "/user/getEqOnMonth",
      params: {
        year: now,
      },
    }).then(
      function querySuccess(response) {
        var data = angular.copy(response.data);
        data.forEach((item) => {
          dmonth[parseInt(item.month) - 1] = parseInt(item.count);
        });
        $scope.dataEqMonth = [Object.values(dmonth)];
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.selectDateEqOnMonth = function (today2) {
    var dateMonth = today2.getFullYear();
    dmonth = [];
    for (var i = 0; i < nmonth; i++) {
      var c = "0";
      dmonth.push(c);
    }
    $http({
      method: "GET",
      url: "/user/getEqOnMonth",
      params: {
        year: dateMonth,
      },
    }).then(function querySuccess(response) {
      let data = angular.copy(response.data);
      data.forEach((item) => {
        dmonth[parseInt(item.month) - 1] = parseInt(item.count);
      });
      $scope.dataEqMonth = [Object.values(dmonth)];
      console.log($scope.dataEqMonth[0]);
    });
  };

  $scope.lastEqOnYear = function () {
    var sly = new Date().getFullYear();
    dmag = [];
    for (var i = 0; i < nmag; i++) {
      var c = "0";
      dmag.push(c);
    }
    $http({
      method: "GET",
      url: "/user/getEqOnMag",
      params: {
        year: sly,
      },
    }).then(function querySuccess(response) {
      let data = angular.copy(response.data);
      data.forEach((item) => {
        // if (item !== 0) {
        dmag[parseInt(item.mag)] = parseInt(item.count);
        // }
      });
      $scope.dataEqMag = [Object.values(dmag)]; //push nilai count ke label mag
    });
  };

  $scope.selectDateEqOnYear = function (today2) {
    var dateMag = today2.getFullYear();
    dmag = [];
    for (var i = 0; i < nmag; i++) {
      var c = "0";
      dmag.push(c);
    }
    $http({
      method: "GET",
      url: "/user/getEqOnMag",
      params: {
        year: dateMag,
      },
    }).then(function querySuccess(response) {
      let data = angular.copy(response.data);
      data.forEach((item) => {
        // if (item !== 0) {
        dmag[parseInt(item.mag)] = parseInt(item.count);
        // }
      });
      $scope.dataEqMag = [Object.values(dmag)]; //push nilai count ke label mag
    });
  };

  $scope.dateRange = function () {
    $scope.today = new Date();
    $scope.today2 = new Date();
    $scope.minDate = new Date([1907]);
  };
  $scope.dateRange();

  $scope.dateOptions = {
    minMode: "year",
  };
  // End chart dynamic

  // Styling EqMonth
  $scope.optionsBulan = {
    title: {
      display: true,
      text: "",
      fontColor: "rgba(255,0,0,0.8)",
      fontSize: 16,
      padding: -10,
    },
    scales: {
      xAxes: [{
        position: "bottom",
        gridLines: {
          display: false,
        },
        ticks: {
          fontColor: "#000",
          fontSize: 14,
          beginAtZero: true,
        },
      }, ],
      yAxes: [{
        position: "right",
        ticks: {
          fontColor: "#9FA2B4",
          fontSize: 14,
          steps: 40,
          stepValue: 10,
          beginAtZero: true,
        },
      }, ],
    },
  };
  $scope.dataOverrideBulan = [{
    label: ["Jumlah Titik"],
    fill: true,
    lineTension: 0.2,
    borderColor: "rgba(55,81,255,1)",
    backgroundColor: "rgba(55,81,255,0.08)",
    radius: 4,
    pointStyle: "circle",
    pointBackgroundColor: "rgba(55,81,255,1)",
    pointHoverBackgroundColor: "rgba(55,81,255,1)",
    hitRadius: 3,
    hoverRadius: 3,
    overBorderWidth: 20,
  }, ];

  // Styling chart EqMag
  $scope.optionsMagnitude = {
    title: {
      display: true,
      text: "",
      fontColor: "rgba(0,100,192,0.8)",
      fontSize: 16,
      padding: -10,
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false,
        },
        position: "bottom",
        ticks: {
          fontColor: "#000",
          fontSize: 14,
          beginAtZero: true,
        },
      }, ],
      yAxes: [{
        position: "right",
        ticks: {
          fontColor: "#9FA2B4",
          fontSize: 14,
          steps: 40,
          stepValue: 10,
          beginAtZero: true,
        },
      }, ],
    },
  };

  // Canvas EqMag
  $scope.dataOverrideMagnitude = [{
    label: ["Jumlah Titik"],
    fill: true,
    lineTension: 0.2,
    borderColor: "rgba(107,181,229,1)",
    backgroundColor: "rgba(107,181,229,1)",
    radius: 4,
    pointStyle: "circle",
    pointBackgroundColor: "rgba(107,181,229,1)",
    pointHoverBackgroundColor: "rgba(107,181,229,1)",
    hitRadius: 3,
    hoverRadius: 3,
    overBorderWidth: 20,
  }, ];

  $scope.getEqDetail = function () {
    $http({
      method: "GET",
      url: "/user/getEqDetail",
    }).then(
      function querySuccess(response) {
        $scope.eqDetail = angular.copy(response.data);
        if (response.data.length > 0) {
          $scope.eqTotal = response.data.length;
          console.log('eqTotal', $scope.eqTotal)
        } else {
          $scope.eqTotal = "0";
        }
        $scope.isLoading = false;
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.getTsuDetail = function () {
    $http({
      method: "GET",
      url: "/user/getTsuDetail",
    }).then(
      function querySuccess(response) {
        $scope.tsuDetail = angular.copy(response.data);
        if (response.data.length > 0) {
          $scope.tsuTotal = response.data.length;
          console.log($scope.tsuDetail);
        } else {
          $scope.tsuTotal = "0";
        }
        $scope.isLoading = false;
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };

  $scope.bottomPred = function () {
    if (!falarm1) {
      //run the event that was passed through
      falarm1 = true;
      $timeout(function () {
        if (falarm1 == true) {
          pagn1 += pgad;
          $scope.refreshListPred(pagn1);
          console.log("Hit the end");
          falarm1 = false;
        }
      }, 500);
    }
  };
  $scope.refreshListPred = function (ofs) {
    $http({
      method: "GET",
      url: "/verif/webgis/getDatePred",
      params: {
        offnum: ofs,
        modid: modsel,
        ldt: tsudt,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.predDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.predDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.refreshListPred2 = function (ofs) {
    $http({
      method: "GET",
      url: "/verif/webgis/getDatePred",
      params: {
        offnum: ofs,
        modid: modsel,
        ldt: tsudt,
      },
    }).then(
      function querySuccess(response) {
        var result = response.data.map(function (el) {
          var o = Object.assign({}, el);
          $scope.predDateGroup.filter(function (hsit) {
            if (hsit.id == o.id) {
              if (hsit.check) {
                o.check = true;
              } else {
                o.check = false;
              }
            }
          });
          return o;
        });
        angular.copy(result, $scope.predDateGroup);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.bottomEQ = function () {
    if (!falarm2) {
      //run the event that was passed through
      falarm2 = true;
      $timeout(function () {
        if (falarm2 == true) {
          pagn2 += pgad;
          $scope.refreshListEQ(pagn2);
          console.log("Hit the end");
          falarm2 = false;
        }
      }, 500);
    }
  };
  $scope.refreshListEQ = function (ofs) {
    $http({
      method: "GET",
      url: "/verif/webgis/getDateEQ",
      params: {
        offnum: ofs,
        ldt: eqdt,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.length > 0) {
          var temp = $scope.eqDateGroup;
          temp = temp.concat(response.data);
          angular.copy(temp, $scope.eqDateGroup);
          console.log($scope.eqDateGroup);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.refreshListEQ2 = function (ofs) {
    $http({
      method: "GET",
      url: "/verif/webgis/getDateEQ",
      params: {
        offnum: ofs,
        ldt: eqdt,
      },
    }).then(
      function querySuccess(response) {
        var result = response.data.map(function (el) {
          var o = Object.assign({}, el);
          $scope.eqDateGroup.filter(function (hsit) {
            if (hsit.id == o.id) {
              if (hsit.check) {
                o.check = true;
              } else {
                o.check = false;
              }
            }
          });
          return o;
        });
        angular.copy(result, $scope.eqDateGroup);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.getSensorType = function () {
    $http({
      method: "GET",
      url: "/verif/webgis/getSensor",
    }).then(
      function querySuccess(response) {
        angular.copy(response.data, $scope.sensorGroup);
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.dateCompare = function (targ) {
    var ctime = new Date();
    var timezone = ctime.getTimezoneOffset() / 60;
    ctime.setHours(ctime.getHours() - (2 - timezone));
    const tgtime = new Date(targ);
    if (tgtime >= ctime) {
      return true;
    } else {
      return false;
    }
  };
  $scope.chooseModel = function (ev) {
    $mdDialog
      .show({
        controller: "changemodeldialog",
        parent: angular.element(document.body),
        templateUrl: "dialog/changemodel/changemodel.template.html",
        targetEvent: ev,
        locals: {
          dataToPass: modsel,
        },
      })
      .then(function (response) {
        mapService_dashboard.clearMap();
        console.log(response);
        modsel = response;
        $scope.predDateGroup = [];
        $scope.refreshListPred(0);
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.predItemCheck = function (tid_chk) {
    $scope.predDateGroup.filter(function (hsit) {
      if (hsit.id == tid_chk) {
        if (hsit.check) {
          console.log(tid_chk);
          $http({
            method: "GET",
            url: "/verif/webgis/getPredTsu",
            params: {
              timid: tid_chk,
              modid: modsel,
            },
          }).then(
            function querySuccess(response) {
              if (response.data.features.length > 0) {
                mapService_dashboard.drawHS("predTsu_" + tid_chk, response.data);
                $scope.eqForceItemCheck(tid_chk);
              }
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        } else {
          console.log("close " + tid_chk);
          mapService_dashboard.removeHS("predTsu_" + tid_chk);
          mapService_dashboard.removeHS("EQ_" + tid_chk);
        }
      }
    });
  };
  $scope.eqForceItemCheck = function (tid_chk) {
    $http({
      method: "GET",
      url: "/verif/webgis/getEQ",
      params: {
        timid: tid_chk,
      },
    }).then(
      function querySuccess(response) {
        if (response.data.features.length > 0) {
          mapService_dashboard.drawHS("EQ_" + tid_chk, response.data);
        }
      },
      function queryError(response) {
        console.log("connection failed");
      }
    );
  };
  $scope.eqItemCheck = function (tid_chk) {
    console.log(tid_chk);
    $scope.eqDateGroup.filter(function (hsit) {
      if (hsit.id == tid_chk) {
        if (hsit.check) {
          console.log(tid_chk);
          $http({
            method: "GET",
            url: "/verif/webgis/getEQ",
            params: {
              timid: tid_chk,
            },
          }).then(
            function querySuccess(response) {
              if (response.data.features.length > 0) {
                mapService_dashboard.drawHS("EQ_" + tid_chk, response.data);
              }
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        } else {
          console.log("close " + tid_chk);
          mapService_dashboard.removeHS("EQ_" + tid_chk);
        }
      }
    });
  };
  $scope.sensorItemCheck = function (sensname, tid_chk, citem) {
    const senstp = sensname.split("_")[0];
    if (senslatest) {
      sensdtm = new Date().toISOString();
    }
    $scope.sensorGroup.filter(function (hsit) {
      if (hsit.id == tid_chk) {
        if (hsit.check) {
          console.log(tid_chk);
          citem.loading = true;
          $http({
            method: "GET",
            url: "/verif/webgis/getSensLoc",
            params: {
              timid: tid_chk,
              ltime: sensdtm,
            },
          }).then(
            function querySuccess(response) {
              if (response.data.features.length > 0) {
                mapService_dashboard.drawHS(sensname + "_" + tid_chk, response.data);
              }
              citem.loading = false;
            },
            function queryError(response) {
              console.log("connection failed");
            }
          );
        } else {
          console.log("close " + tid_chk);
          citem.loading = false;
          mapService_dashboard.removeHS(sensname + "_" + tid_chk);
        }
      }
    });
  };

  function initTime() {
    $timeout(function () {
      const spl = sensdtm.split("T")[1].split(".")[0];
      var options = {
        now: spl,
        twentyFour: true,
        showSeconds: true,
      };
      timepicker = $(".timepicker").wickedpicker(options);
    }, 2000);
  }
  $scope.sensChooseTime = function (ev) {
    $mdDialog
      .show({
        scope: $scope,
        templateUrl: "dialog/sensorconfig/sensorconfig.template.html",
        parent: angular.element(document.body),
        multiple: true,
        preserveScope: true,
        escapeToClose: true,
        clickOutsideToClose: true,
        onComplete: initTime(),
        targetEvent: ev,
      })
      .then(function (response) {
        console.log("add data");
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.eqChooseTime = function (ev) {
    $mdDialog
      .show({
        scope: $scope,
        templateUrl: "dialog/eqconfig/eqconfig.template.html",
        parent: angular.element(document.body),
        multiple: true,
        preserveScope: true,
        escapeToClose: true,
        clickOutsideToClose: true,
        targetEvent: ev,
      })
      .then(function (response) {
        console.log("add data");
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.tsuChooseTime = function (ev) {
    $mdDialog
      .show({
        scope: $scope,
        templateUrl: "dialog/tsuconfig/tsuconfig.template.html",
        parent: angular.element(document.body),
        multiple: true,
        preserveScope: true,
        escapeToClose: true,
        clickOutsideToClose: true,
        targetEvent: ev,
      })
      .then(function (response) {
        console.log("add data");
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.sensChangeTime = function (ttp) {
    $mdDialog.hide("select");
    if (ttp == "latest") {
      sensdtm = new Date().toISOString();
      senslatest = true;
    } else {
      const dtonly = $scope.sensdate.toLocaleDateString("zh-Hans-CN");
      console.log(dtonly);
      var tmonly = timepicker.wickedpicker("time");
      tmonly = tmonly.replace(/\s/g, "");
      sensdtm = dtonly + "T" + tmonly;
      senslatest = false;
    }
    $scope.sensorGroup.filter(function (hsit) {
      if (hsit.check) {
        const sensname = hsit.name;
        const tid_chk = hsit.id;
        hsit.loading = true;
        $http({
          method: "GET",
          url: "/verif/webgis/getSensLoc",
          params: {
            timid: tid_chk,
            ltime: sensdtm,
          },
        }).then(
          function querySuccess(response) {
            mapService_dashboard.removeHS(sensname + "_" + tid_chk);
            if (response.data.features.length > 0) {
              mapService_dashboard.drawHS(sensname + "_" + tid_chk, response.data);
            }
            hsit.loading = false;
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      }
    });
  };
  $scope.eqChangeTime = function (ttp) {
    $mdDialog.hide("select");
    if (ttp == "all") {
      eqdt = "all";
      $scope.eqdate = "";
    } else {
      eqdt = $scope.eqdate.toLocaleDateString("zh-Hans-CN");
    }
    $scope.eqDateGroup.filter(function (hsit) {
      mapService_dashboard.removeHS("EQ_" + hsit.id);
      hsit.check = false;
    });
    pagn2 = 0;
    $scope.refreshListEQ2(0);
  };
  $scope.tsuChangeTime = function (ttp) {
    $mdDialog.hide("select");
    if (ttp == "all") {
      tsudt = "all";
      $scope.tsudate = "";
    } else {
      tsudt = $scope.tsudate.toLocaleDateString("zh-Hans-CN");
    }
    $scope.predDateGroup.filter(function (hsit) {
      mapService_dashboard.removeHS("EQ_" + hsit.id);
      mapService_dashboard.removeHS("predTsu_" + hsit.id);
      hsit.check = false;
    });
    pagn2 = 1;
    $scope.refreshListPred2(0);
  };
  $scope.changeTsuState = function (ev, idi, dtm, tst) {
    $scope.tsudtsel = dtm;
    $scope.tsustatus = tst;
    $mdDialog
      .show({
        scope: $scope,
        templateUrl: "dialog/changestatus/changestatus.template.html",
        parent: angular.element(document.body),
        multiple: true,
        preserveScope: true,
        escapeToClose: true,
        clickOutsideToClose: true,
        targetEvent: ev,
      })
      .then(function (response) {
        $http({
          method: "GET",
          url: "/verif/webgis/getUpdateTsu",
          params: {
            tsuid: idi,
            nust: $scope.tsustatus,
          },
        }).then(
          function querySuccess(response) {
            $scope.refreshListPred2(0);
          },
          function queryError(response) {
            console.log("connection failed");
          }
        );
      })
      .catch(function (responseIfRejected) {
        console.log("cancel");
      });
  };
  $scope.finishChangeState = function () {
    $mdDialog.hide();
  };

  $scope.isLoading = true;
  $scope.refreshListPred(0);
  $scope.refreshListEQ(0);
  $scope.getSensorType();
  $scope.lastEqOnYear();
  $scope.lastEqOnMonth();
  $scope.getEqDetail();

  $interval(function () {
    $scope.refreshListEQ2(0);
    $scope.refreshListPred2(0);
    // $scope.getEqDetail();
    // $scope.lastEqOnYear();
    // $scope.lastEqOnMonth()
  }, 1000);
  // end webgis
}
// End chartGempaMag