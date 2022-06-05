"use strict";

angular.module("layerControl").controller("hwStatsCtrl", ["$scope", "$http", "$interval", hwStatsCtrl]);

function hwStatsCtrl($scope, $http, $interval) {
  var hwst = "";
  // chart hawrdware
  // $scope.pie1 = {};
  $scope.bar3 = {};
  $scope.bar4 = {};
  $scope.pie2 = {};
  $scope.bar5 = {};

  function loadHWSt(key, callback) {
    $http({
      method: "GET",
      url: "/admin/hw/getHWStats",
    }).then(
      function querySuccess(response) {
        $scope.hwst = angular.copy(response.data);
        console.log($scope.hwst[0].tags);
        console.log($scope.hwst[1].tags);
        console.log($scope.hwst[2].tags);
        callback(response);
      },
      function errorCallback(response) {
        throw new Error("connection failed");
      }
    );
  }

  function myCallbackFunction(response) {
    hwst = response.data;
    // console.log(myVariable[0].tags[0].val); debug disk free
    // console.log(hwst[1].tags[4].val.replace("TB", '')); //disk usage

    $scope.pie2.options = {
      color: ["rgba(8, 55, 172, 0.3)", "#0837AC"],
      // tooltip: {
      //         trigger: "item",
      //         formatter: "{a} <br/>{b}  TB : {c} ({d}%)"
      // },
      // legend: {
      //         orient: "horizontal",
      //         x: "center",
      //         data: ["Pemakaian", "Tersedia"],
      // },
      toolbox: {
        show: !0,
        feature: {
          restore: {
            show: !0,
            title: "refresh",
          },
          // saveAsImage: {
          //         show: !0,
          //         title: "save as image"
          // },
        },
      },
      // calculable: !0,
      series: [
        {
          // name: "Prosentase : ",
          type: "pie",
          radius: ["60%", "85%"],
          itemStyle: {
            normal: {
              label: {
                show: !1,
              },
              labelLine: {
                show: !1,
              },
            },
            emphasis: {
              show: !0,
              label: {
                show: !0,
                formatter: "{d}% \n {b}",
                position: "center",
                textStyle: {
                  fontSize: "20",
                  fontFamily: "Poppins",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: 45,
                },
              },
            },
          },
          data: [
            {
              value: hwst[0].tags[0].val.replace("TB", ""),
              name: "Tersedia",
              label: {
                show: !0,
                formatter: "{c} ({d}%)",
                fontSize: 15,
              },
            },

            {
              value: hwst[0].tags[1].val.replace("TB", ""),
              name: "Penggunaan",
              label: {
                show: !0,
                formatter: "{c} ({d}%)",
                fontSize: 15,
              },
            },
          ],
        },
      ],
    };

    $scope.bar3.options = {
      color: ["#0837AC"],
      // title: {
      //         text: 'World Population',
      //         subtext: 'From the Internet'
      // },
      tooltip: {
        trigger: "axis",
      },
      // legend: {
      //         data: ['2011', '2012']
      // },
      // grid: {
      //         left: 400
      // },
      toolbox: {
        show: true,
        feature: {
          restore: {
            show: true,
            title: "restore",
          },
          // saveAsImage: {
          //         show: true,
          //         title: "save as image"
          // }
        },
      },
      // calculable: true,
      xAxis: [
        {
          type: "value",
          boundaryGap: [0, 0.1],
          min: 0,
          interval: 10,
          max: 100,
        },
      ],
      yAxis: [
        {
          type: "category",
          data: ["RAM", "CPU", "GPU 2", "GPU 1"],
        },
      ],
      series: [
        {
          name: "Utilization",
          type: "bar",
          data: [hwst[1].tags[5].val.replace("%", ""), hwst[1].tags[4].val.replace("%", ""), hwst[1].tags[2].val.replace("%", ""), hwst[1].tags[0].val.replace("%", "")],
        },
        {
          name: "Memory",
          type: "bar",
          data: [0, 0, hwst[1].tags[3].val.replace("%", ""), hwst[1].tags[1].val.replace("%", "")],
        },
      ],
    };

    $scope.bar4.options = {
      color: ["#0837AC"],
      // title: {
      //         text: 'World Population',
      //         subtext: 'From the Internet'
      // },
      tooltip: {
        trigger: "axis",
      },
      // legend: {
      //         data: ['2011', '2012']
      // },
      // grid: {
      //         left: 400
      // },
      toolbox: {
        show: true,
        feature: {
          restore: {
            show: true,
            title: "restore",
          },
          // saveAsImage: {
          //         show: true,
          //         title: "save as image"
          // }
        },
      },
      // calculable: true,
      xAxis: [
        {
          type: "value",
          boundaryGap: [0, 0.01],
          min: 0,
          interval: 10,
          max: 100,
        },
      ],
      yAxis: [
        {
          type: "category",
          data: ["RAM", "CPU", "GPU 7", "GPU 6", "GPU 5", "GPU 4", "GPU 3", "GPU 2", "GPU 1", "GPU 0"],
        },
      ],
      series: [
        {
          name: "Utilization",
          type: "bar",
          data: [
            hwst[2].tags[16].val.replace("%", ""),
            hwst[2].tags[17].val.replace("%", ""),
            hwst[2].tags[12].val.replace("%", ""),
            hwst[2].tags[10].val.replace("%", ""),
            hwst[2].tags[8].val.replace("%", ""),
            hwst[2].tags[6].val.replace("%", ""),
            hwst[2].tags[4].val.replace("%", ""),
            hwst[2].tags[2].val.replace("%", ""),
            hwst[2].tags[0].val.replace("%", ""),
          ],
        },
        {
          name: "Memory",
          type: "bar",
          data: [
            hwst[2].tags[15].val.replace("%", ""),
            hwst[2].tags[13].val.replace("%", ""),
            hwst[2].tags[11].val.replace("%", ""),
            hwst[2].tags[9].val.replace("%", ""),
            hwst[2].tags[7].val.replace("%", ""),
            hwst[2].tags[5].val.replace("%", ""),
            hwst[2].tags[3].val.replace("%", ""),
          ],
        },
      ],
    };
    return hwst;
  }

  var reloadHW = undefined;
  $scope.logHWStats = function () {
    loadHWSt("MY_KEY", myCallbackFunction);
    reloadHW = $interval(function () {
      loadHWSt("MY_KEY", myCallbackFunction);
    }, 60000);
  };
  $scope.logHWStats();
}
