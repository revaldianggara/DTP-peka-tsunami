"use strict";

angular.module("layerControl").component("layerControl", {
  templateUrl: "layer-control/layer-control.template.html",
  controller: function layercontrolController(
    $scope,
    $http,
    $mdSidenav,
    mapService,
    $interval
  ) {
    $scope.line = "line";
    $scope.bar = "bar";
    $scope.index = 0;
    $scope.toggle = {};
    $scope.toggle.iconDefault = true;
    $scope.firstTimeEq = 0;
    $scope.firstTimeTsu = 0;
    $scope.visibleGempa = false;
    $scope.visibleTsunami = false;
    $scope.visibleLokasi = false;
    $scope.visibleGrafik = false;
    $scope.category = "bulan";
    $scope.visibleChartBulan = true;
    $scope.visibleChartMagnitude = false;
    $scope.visibleEqOnMonth = true;
    $scope.visibleEqOnYear = false;
    $scope.hs = mapService.info_detail;
    var eqar = [];
    $scope.closesidenav = function () {
      $mdSidenav("right").close();
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
    $scope.thisyear = new Date().getFullYear();

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

    $scope.open = function ($event) {
      $scope.popup.opened = true;
    };


    $scope.lastEqOnMonth = function () {
      var now = new Date().getFullYear();
      var dmonth = [];
      for (var i = 0; i < nmonth; i++) {
        var c = "0";
        dmonth.push(c);
      }
      $http({
        method: "GET",
        url: "/getEqOnMonth",
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
    $scope.lastEqOnMonth();

    $scope.selectDateEqOnMonth = function (today2) {
      var dateMonth = today2.getFullYear();
      dmonth = [];
      for (var i = 0; i < nmonth; i++) {
        var c = "0";
        dmonth.push(c);
      }
      $http({
        method: "GET",
        url: "/getEqOnMonth",
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
        url: "/getEqOnMag",
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
        url: "/getEqOnMag",
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

    $scope.popup = {
      opened: false,
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
        url: "/getEqDetail",
      }).then(
        function querySuccess(response) {
          $scope.eqDetail = angular.copy(response.data);
          if (response.data.length > 0) {
            $scope.eqTotal = response.data.length;
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
        url: "/getTsuDetail",
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

    $scope.predItemCheck = function (eqid) {
      $http({
        method: "GET",
        url: "/getLastTsu",
        params: {
          eq_id: eqid,
        },
      }).then(
        function querySuccess(response) {
          if (response.data.features) {
            mapService.drawHS("predTsu_" + eqid, response.data);
            $mdSidenav("right").open();
          }
        },
        function queryError(response) {
          console.log("connection failed");
        }
      );
    };
    $scope.getLocTsu = function (eqid) {
      $http({
        method: "GET",
        url: "/getTsuLoc",
        params: {
          eq_id: eqid,
        },
      }).then(
        function querySuccess(response) {
          $scope.areatsunami = response.data;
        },
        function queryError(response) {
          console.log("connection failed");
        }
      );
    };
    $scope.getLastEQ = function () {
      $http({
        method: "GET",
        url: "/getLastEQ",
      }).then(
        function querySuccess(response) {
          if (response.data.features) {
            const neqar = response.data.features;
            const toadd = neqar.filter(
              ({
                id: id1
              }) => !eqar.some(({
                id: id2
              }) => id2 === id1)
            );
            const todel = eqar.filter(
              ({
                id: id1
              }) => !neqar.some(({
                id: id2
              }) => id2 === id1)
            );
            eqar = neqar;
            toadd.map(function (el) {
              var ngjson = {};
              ngjson.type = "FeatureCollection";
              ngjson.features = [];
              ngjson.features.push(el);
              mapService.drawHS("EQ_" + el.id, ngjson);
              $scope.predItemCheck(el.id);
              $scope.getLocTsu(el.id);
            });
            todel.map(function (el) {
              mapService.removeHS("EQ_" + el.id);
              mapService.removeHS("predTsu_" + el.id);
            });
          } else {
            mapService.clearMap();
            $scope.areatsunami = [];
          }
        },
        function queryError(response) {
          console.log("connection failed");
        }
      );
    };

    $scope.hideGempa = function () {
      $scope.visibleGempa = false;
      $scope.toggle.EqIcon = false;
      $scope.visibleGempa = false;
      $scope.toggle.EqIcon = false;
    };

    $scope.showTsunami = function () {
      $scope.toggle.EqIcon = false;
      $scope.toggle.iconDefault = false;
      $scope.toggle.iconReg = false;
      $scope.toggle.iconChart = false;
      $scope.visibleTsunami = $scope.visibleTsunami ? false : true;
      $scope.visibleGempa = false;
      $scope.visibleLokasi = false;
      $scope.visibleGrafik = false;
      if ($scope.firstTimeTsu === 0) {
        $scope.firstTimeTsu = ++$scope.firstTimeTsu;
        $scope.isLoading = true;
        $scope.getTsuDetail();
        $interval(function () {
          // console.log("tsunami history automatic on");
          $scope.getTsuDetail();
        }, 1000 * 30);
      } else {
        return;
      }
    };

    // all function
    $scope.hideAll = function () {
      $scope.toggle.EqIcon = false;
      $scope.toggle.iconTsu = false;
      $scope.toggle.iconReg = false;
      $scope.toggle.iconChart = false;
      $scope.visibleGempa = false;
      $scope.visibleTsunami = false;
      $scope.visibleLokasi = false;
      $scope.visibleGrafik = false;
    };

    $scope.showGempa = function () {
      $scope.toggle.iconDefault = false;
      $scope.toggle.iconTsu = false;
      $scope.toggle.iconReg = false;
      $scope.toggle.iconChart = false;
      $scope.visibleGempa = $scope.visibleGempa ? false : true;
      $scope.visibleTsunami = false;
      $scope.visibleLokasi = false;
      $scope.visibleGrafik = false;
      if ($scope.firstTimeEq === 0) {
        $scope.firstTimeEq = ++$scope.firstTimeEq;
        $scope.isLoading = true;
        $scope.getEqDetail();
        $interval(function () {
          // console.log("earthquake history automatic on");
          $scope.getEqDetail();
        }, 1000 * 30);
      } else {
        return;
      }
    };

    $scope.hideTsunami = function () {
      $scope.visibleTsunami = false;
      $scope.toggle.iconTsu = false;
    };
    $scope.showLokasi = function () {
      $scope.toggle.EqIcon = false;
      $scope.toggle.iconTsu = false;
      $scope.toggle.iconDefault = false;
      $scope.toggle.iconChart = false;
      $scope.visibleLokasi = $scope.visibleLokasi ? false : true;
      $scope.visibleTsunami = false;
      $scope.visibleGempa = false;
      $scope.visibleGrafik = false;
    };
    $scope.showGrafik = function () {
      $scope.toggle.EqIcon = false;
      $scope.toggle.iconTsu = false;
      $scope.toggle.iconReg = false;
      $scope.toggle.iconDefault = false;
      $scope.visibleGrafik = $scope.visibleGrafik ? false : true;
      $scope.visibleTsunami = false;
      $scope.visibleGempa = false;
      $scope.visibleLokasi = false;
    };
    $scope.showChartBulan = function (id) {
      $scope.category = id;
      $scope.visibleChartMagnitude = false;
      $scope.visibleChartBulan = true;
      $scope.visibleEqOnMonth = true;
      $scope.visibleEqOnYear = false;
    };
    $scope.showChartMagnitude = function (id) {
      $scope.category = id;
      $scope.visibleChartMagnitude = $scope.visibleChartMagnitude ?
        false :
        true;
      $scope.visibleChartBulan = false;
      $scope.visibleChartMagnitude = true;
      $scope.visibleEqOnMonth = false;
      $scope.visibleEqOnYear = true;
    };

    $scope.getLastEQ();
    $interval(function () {
      $scope.getLastEQ();
    }, 1000 * 30);

    var baseLayerElements = document.querySelectorAll('input[type=radio]')
    for (var baseLayerElement of baseLayerElements) {
      baseLayerElement.addEventListener('change', function () {
        var baseLayerElementValue = this.value;
        mapService.baseLayerGroup.getLayers().forEach(function (element, index, array) {
          baseLayerName = element.get('title');
          console.log(baseLayerName)
          console.log('base layer name selected', baseLayerName)
          element.setVisible(baseLayerName === baseLayerElementValue)
        })
      })
    }
  },

});