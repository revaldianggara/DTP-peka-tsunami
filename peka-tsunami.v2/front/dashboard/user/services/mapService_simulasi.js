angular.module("mapService_simulasi", [])
    .factory('mapService_simulasi', function () {
        var mapObj;
        var viewObj;
        var pointsource;
        var vector;
        var services = {};
        services.simul_clicked = undefined;
        services.type_clicked = undefined;
        services.info_sumber = [];
        services.info_target = [];
        const pinpointStyle = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 250],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.1,
                src: 'assets/images/webgis/pin-yellow.png'
            })
        });
        // removeSource = function (idn) {
        //     var layerToRemove = [];
        //     mapObj.getLayers().forEach(function (layer) {
        //         if (layer.get('name') != undefined) {
        //             const rdnm = 'red_' + idn;
        //             if (layer.get('name') === idn || layer.get('name') === rdnm) {
        //                 layerToRemove.push(layer);
        //             }
        //         }
        //     });

        //     var len = layerToRemove.length;
        //     for (var i = 0; i < len; i++) {
        //         mapObj.removeLayer(layerToRemove[i]);
        //     }
        // }
        services.drawSource = function (idn, gjson) {
            if (gjson.features == null) {
                console.log("No Data Found!");
            } else {
                var sumber = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(gjson)
                });
                sumber.forEachFeature(function (feature) {

                    const tpointStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            scale: 0.05,
                            src: 'assets/images/webgis/eq.png'
                        })
                    });
                    feature.setStyle(tpointStyle);
                });
                var sourcevector = new ol.layer.Vector({
                    source: sumber
                });
                sourcevector.set('name', idn);
                mapObj.addLayer(sourcevector);
                sourcevector.setZIndex(30);
            }
        }
        services.drawTarget = function (idn, gjson) {
            if (gjson.features == null) {
                console.log("No Data Found!");
            } else {
                var targetsource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(gjson)
                });
                targetsource.forEachFeature(function (feature) {

                    const tpointStyle = new ol.style.Style({
                        image: new ol.style.Icon({
                            anchor: [0.5, 0.5],
                            anchorXUnits: 'fraction',
                            anchorYUnits: 'fraction',
                            scale: 0.05,
                            src: 'assets/images/webgis/wave5.png'
                        })
                    });
                    feature.setStyle(tpointStyle);
                });
                var targetvector = new ol.layer.Vector({
                    source: targetsource
                });
                targetvector.set('name', idn);
                mapObj.addLayer(targetvector);
                targetvector.setZIndex(30);
            }
        }
        services.mapInit = function (mapobj, viewobj) {
            mapObj = mapobj;
            viewObj = viewobj;
        };
        services.drawPoint = function (gjson) {
            if (!gjson) {
                pointsource = new ol.source.Vector();
            } else {
                pointsource = new ol.source.Vector({
                    features: (new ol.format.GeoJSON()).readFeatures(gjson)
                });
            }
            vector = new ol.layer.Vector({
                source: pointsource
            });
            vector.set('name', 'tempolygon');
            vector.setStyle(pinpointStyle);
            mapObj.addLayer(vector);
            vector.setZIndex(9999);
            draw = new ol.interaction.Draw({
                source: pointsource,
                type: "Point",
                style: pinpointStyle
            });
            mapObj.addInteraction(draw);
            vector.getSource().on('addfeature', function (event) {
                var vctrs = vector.getSource().getFeatures();
                if (vctrs.length > 1) {
                    console.log('remove point');
                    vector.getSource().removeFeature(vctrs[0]);
                }
            });
        }
        services.clearMap = function () {
            var layersToRemove = [];
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined) {
                    var lynm = layer.get('name');
                    if (lynm === "Sumber" || lynm === "Target") {
                        layersToRemove.push(layer);
                    }
                }
            });

            var len = layersToRemove.length;
            for (var i = 0; i < len; i++) {
                mapObj.removeLayer(layersToRemove[i]);
            }
        };
        services.selectSource = function (feature, layername) {
            if (services.simulasi_clicked !== undefined || feature === undefined) {
                if (services.type_clicked === undefined) {
                    console.log('do nothing');
                } else {
                    mapObj.getLayers().forEach(function (layer) {
                        const lyrnm = layer.get('name');
                        if (lyrnm == services.type_clicked) {
                            var ssource = layer.getSource();
                            ssource.forEachFeature(function (feature) {
                                if (feature.id_ == services.source_clicked) {
                                    const layertype = services.type_clicked
                                    // var ity = 'eq';
                                    if (layertype == 'Sumber') {
                                        ity = 'eq';
                                    } else if (layertype == 'Target') {
                                        ity = 'wave5';
                                    }
                                    // console.log(services.type_clicked);
                                    console.log(ity);
                                    const rpointStyle = new ol.style.Style({
                                        image: new ol.style.Icon({
                                            anchor: [0.5, 1],
                                            anchorXUnits: 'fraction',
                                            anchorYUnits: 'fraction',
                                            scale: 0.05,
                                            src: 'assets/images/webgis/' + ity + '.png'
                                        })
                                    });
                                    feature.setStyle(rpointStyle);
                                }
                            });
                        }
                    });
                    // $mdSidenav('right').close();
                }
            }
            if (feature !== undefined) {
                console.log(services.info_sumber);
                console.log(services.info_target);
                const curzm = viewObj.getZoom();
                var zoomto = 7;
                if (curzm > zoomto) {
                    zoomto = curzm;
                }
                var ity = 'c';
                // print nama layername nya (sumber atau target)
                console.log(layername);
                var layertype = layername
                if (layertype == 'Sumber') {
                    ity = 'pin-yellow';
                } else if (layertype == 'Target') {
                    ity = 'pin';
                }
                services.source_clicked = feature.id_;
                //print id feature (sumber dan target)
                console.log(services.source_clicked);
                services.type_clicked = layername;
                const redpinStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 1],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: 0.17,
                        src: 'assets/images/webgis/' + ity + '.png'
                    })
                });
                feature.setStyle(redpinStyle);
                viewObj.animate({
                    center: feature.getGeometry().getCoordinates(),
                    zoom: zoomto,
                    duration: 1000
                });
                // $mdSidenav('right').open();
                // $scope.showDetail = function () {
                //     $scope.visibleData = $scope.visibleData ? false : true;
                // }
            }
        }
        services.interactionFinished = function () {
            mapObj.removeInteraction(draw);
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('name') != undefined && layer.get('name') === 'tempolygon') {
                    mapObj.removeLayer(layer);
                }
            });
        }
        return services;
    })
    .directive('ngMap', ['mapService_simulasi', '$http', function (mapService_simulasi, $http) {
        return {
            restrict: 'A',
            replace: true,
            link: function ($scope) {
                var view = new ol.View({
                    projection: 'EPSG:4326',
                    center: [113, -1.5],
                    zoom: 4
                })
                var map = new ol.Map({
                    target: 'map_simulasi',
                    controls: ol.control.defaults({
                        attribution: false
                    }),
                    layers: [
                        /*new ol.layer.Tile({
                            source: new ol.source.OSM()
                        }),*/
                        new ol.layer.Tile({
                            source: new ol.source.XYZ({
                                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer/tile/{z}/{y}/{x}',
                            })
                        })
                        // new ol.layer.Tile({
                        //     source: new ol.source.BingMaps({
                        //         name: 'basemap',
                        //         id: 99999,
                        //         key: 'ApxKj5A4BjgMqT3O0s8xDQ8-KBoe51FaaiX4er38T5gyKVcJRjJJgaKRZhor7o_F',
                        //         imagerySet: 'AerialWithLabelsOnDemand'
                        //     })
                        // })
                    ],
                    view: view
                });
                map.on("click", function (e) {
                    var wclk = 0;
                    map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                        const lyrnm = layer.get('name');
                        // layername sumber dan target
                        console.log(lyrnm);
                        $http({
                            method: "GET",
                            url: "/user/simulasi/getSourceDetail",
                            params: {
                                source_id: feature.id_,
                            }
                        }).then(function querySuccess(response) {
                            console.log('sumber detail', response.data)
                            angular.copy(response.data, mapService_simulasi.info_sumber);
                            mapService_simulasi.selectSource(feature, lyrnm);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                        $http({
                            method: "GET",
                            url: "/user/simulasi/getTargetDetail",
                            params: {
                                target_id: feature.id_,
                            }
                        }).then(function querySuccess(response) {
                            console.log('target detail', response.data)
                            angular.copy(response.data, mapService_simulasi.info_target);
                            mapService_simulasi.selectSource(feature, lyrnm);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });

                        wclk = 1;
                        // }
                    });
                    if (wclk == 0) {
                        mapService_simulasi.selectSource(undefined, undefined);
                        mapService_simulasi.source_clicked = undefined;
                        mapService_simulasi.type_clicked = undefined;
                    }
                });
                $('#map_simulasi').data('map_simulasi', map);
                mapService_simulasi.mapInit(map, view);
            }
        };
    }]);