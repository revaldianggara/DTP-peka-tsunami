angular.module("mapService", [])
.factory('mapService', function($mdSidenav) {
    var mapObj;
    var viewObj;
    var draw;
    var pointsource;
    //var hssource;
    var vector;
    var services = {};
    services.hs_clicked = undefined;
    services.sens_clicked = undefined;
    services.type_clicked = undefined;
    services.senstype_clicked = undefined;
    services.showchart = [];
    services.info_detail = [];
    const pinpointStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 250],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            scale: 0.1,
            src: 'img/image/pin-yellow.png'
        })
    });
    const hsRad = new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(0, 10, 180, 0.1)'
        }),
        stroke: new ol.style.Stroke({
            width: 1,
            color: 'rgba(0, 10, 180, 0.6)'
        })
    });
    services.mapInit = function (mapobj, viewobj) {
        mapObj = mapobj;
        viewObj = viewobj;
    }
    services.drawPoint = function (gjson) {
        if (!gjson) {
            pointsource = new ol.source.Vector();
        }
        else {
            pointsource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(gjson)
            });
        }
        vector = new ol.layer.Vector({source: pointsource});
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
        vector.getSource().on('addfeature', function(event){
            var vctrs = vector.getSource().getFeatures();
            if(vctrs.length>1){
                console.log('remove point');
                vector.getSource().removeFeature(vctrs[0]);
            }
        });
    }
    services.removeHS = function (idn) {
        var layersToRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('name') != undefined) {
                const rdnm = 'rad_'+idn;
                if (layer.get('name') === idn || layer.get('name') === rdnm) {
                    layersToRemove.push(layer);
                }
            }
        });

        var len = layersToRemove.length;
        for(var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i]);
        }
    }
    services.drawHS = function (idn, gjson) {
        if (gjson.features == null) {
            console.log("No Hotspot Found!");
        }
        else {
            const idt = idn.split('_')[0];
            var ity = 'eq';
            if (idt == 'EQ') {
                ity = 'eq';
            }
            else if (idt == 'predTsu') {
                ity = 'wave';
            }
            else if (idt == 'GNSS') {
                ity = 'gnss';
            }
            else if (idt.startsWith('Buoy')) {
                ity = 'buoy';
            }
            else if (idt == 'Pasut') {
                ity = 'pasut';
            }
            var hssource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(gjson)
            });
            console.log(gjson.features.length);
            hssource.forEachFeature(function(feature){
                var aity = '';
                if (idt == 'GNSS') {
                    const dlvl = feature.getProperties()['diff'];
                    if (dlvl=='warn') {
                        aity = '_warn';
                    }
                    else if (dlvl=='normal') {
                        aity = '_normal';
                    }
                    else {
                        aity = '';
                    }
                }
                if (idt == 'predTsu') {
                    const dlvl = feature.getProperties()['level'];
                    if (dlvl==1) {
                        aity = '1';
                    }
                    else if (dlvl==2) {
                        aity = '2';
                    }
                    else if (dlvl==3) {
                        aity = '3';
                    }
                    else if (dlvl==4) {
                        aity = '4';
                    }
                    else {
                        aity = '5';
                    }
                }
                const rpointStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 0.5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: 0.05,
                        src: 'img/image/'+ity+aity+'.png'
                    })
                });
                feature.setStyle(rpointStyle);
            });
            var hsvector = new ol.layer.Vector({source: hssource});
            hsvector.set('name', idn);
            mapObj.addLayer(hsvector);
            hsvector.setZIndex(30);
        }
    }
    services.refreshLineup = function(newlu) {
        var lyidx = 0;
        const mlx = newlu.length;
        newlu.forEach(function (layd) {
            mapObj.getLayers().forEach(function (layer) {
                if (layer.get('id') == layd.id) {
                    const nzdx = mlx - lyidx;
                    layer.setZIndex(nzdx);
                }
            });
            lyidx = lyidx+1;
        });
    }
    services.addRasterLayer = function(xyzurl, nuid, zin) {
        var uraster = new ol.layer.Tile({
            preload: true,
            source: new ol.source.XYZ({
                url: xyzurl
            })
        });
        uraster.set('name', 'rastername');
        uraster.set('id', nuid);
        //mapObj.getLayers().insertAt(mapObj.getLayers().getArray().length-2, uraster);
        mapObj.addLayer(uraster);
        uraster.setZIndex(zin);
    }
    services.removeRasterLayer = function(id2c) {
        var tgtlyr = undefined;
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('id') == id2c) {
                tgtlyr = layer;
            }
        });
        if (tgtlyr != undefined) {
            mapObj.removeLayer(tgtlyr);
        }   
    }
    services.changeLayerSource = function(xyzurl, nuid) {
        console.log(nuid);
        var usource = new ol.source.XYZ({
            url: xyzurl
        })
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('id') == nuid) {
                console.log(layer.get('id'));
                layer.setSource(usource);
            }
        });
    }
    services.clearMap = function() {
        var layersToRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('name') != undefined) {
                var lynm = layer.get('name');
                lynm = lynm.split('_')[0];
                if (lynm === 'predTsu') {
                    layersToRemove.push(layer);
                }
            }
        });

        var len = layersToRemove.length;
        for(var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i]);
        }
    }
    services.selectHS = function (feature, layername) {
        if (services.hs_clicked !== undefined || feature === undefined) {
            if (services.type_clicked === undefined) {
                console.log('do nothing');
            }
            else {
                mapObj.getLayers().forEach(function(layer){
                    const lyrnm = layer.get('name');
                    if (lyrnm == services.type_clicked) {
                        console.log(lyrnm);
                        var hssource = layer.getSource();
                        hssource.forEachFeature(function(feature){
                            if (feature.id_ == services.hs_clicked) {
                                const layertype = services.type_clicked.split('_')[0];
                                var ity = 'eq';
                                if (layertype == 'EQ') {
                                    ity = 'eq';
                                }
                                else if (layertype == 'predTsu') {
                                    ity = 'wave';
                                }
                                var aity = '';
                                if (layertype == 'predTsu') {
                                    const dlvl = feature.getProperties()['level'];
                                    if (dlvl==1) {
                                        aity = '1';
                                    }
                                    else if (dlvl==2) {
                                        aity = '2';
                                    }
                                    else if (dlvl==3) {
                                        aity = '3';
                                    }
                                    else if (dlvl==4) {
                                        aity = '4';
                                    }
                                    else if (dlvl==5) {
                                        aity = '5';
                                    }
                                }
                                var scal = 0.05;
                                if (layertype == 'rec') {
                                    cfrgb = '';
                                    ity = 'pin';
                                    scal = 0.1;
                                }
                                const rpointStyle = new ol.style.Style({
                                    image: new ol.style.Icon({
                                        anchor: [0.5, 0.5],
                                        anchorXUnits: 'fraction',
                                        anchorYUnits: 'fraction',
                                        scale: scal,
                                        src: 'img/image/'+ity+aity+'.png'
                                    })
                                });
                                feature.setStyle(rpointStyle);
                            }
                        });
                    }
                });
                $mdSidenav('right').close();
            }
        }
        if (feature !== undefined) {
            const curzm = viewObj.getZoom();
            var zoomto = 10;
            if (curzm > zoomto) {
                zoomto = curzm;
            }
            var ity = 'c';
            console.log(layername);
            const layertype = layername.split('_')[0];
            if (layertype == 'predTsu') {
                ity = 'pin';
            }
            else if (layertype == 'EQ') {
                ity = 'pin-yellow';
            }
            services.hs_clicked = feature.id_;
            services.type_clicked = layername; 
            const redpinStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    scale: 0.17,
                    src: 'img/image/'+ity+'.png'
                })
            });
            feature.setStyle(redpinStyle);
            viewObj.animate({
                center: feature.getGeometry().getCoordinates(),
                zoom: zoomto,
                duration: 1000
            });
            $mdSidenav('right').open();
        }
    }
    services.sensorDetail = function(feature, layername, d2ts) {
        if (services.sens_clicked !== undefined || feature === undefined) {
            if (services.senstype_clicked === undefined) {
                console.log('do nothing');
            }
            else {
                mapObj.getLayers().forEach(function(layer){
                    const lyrnm = layer.get('name');
                    if (lyrnm == services.senstype_clicked) {
                        console.log(lyrnm);
                        var hssource = layer.getSource();
                        hssource.forEachFeature(function(feature){
                            if (feature.id_ == services.sens_clicked) {
                                const layertype = services.senstype_clicked.split('_')[0];
                                var ity = 'gnss';
                                if (layertype == 'GNSS') {
                                    ity = 'gnss';
                                }
                                else if (layertype.startsWith('Buoy')) {
                                    ity = 'buoy';
                                }
                                else if (layertype == 'Pasut') {
                                    ity = 'pasut';
                                }
                                var aity = '';
                                if (layertype == 'GNSS') {
                                    const dlvl = feature.getProperties()['diff'];
                                    if (dlvl=='warn') {
                                        aity = '_warn';
                                    }
                                    else if (dlvl=='normal') {
                                        aity = '_normal';
                                    }
                                    else {
                                        aity = '';
                                    }
                                }
                                var scal = 0.05;
                                const rpointStyle = new ol.style.Style({
                                    image: new ol.style.Icon({
                                        anchor: [0.5, 0.5],
                                        anchorXUnits: 'fraction',
                                        anchorYUnits: 'fraction',
                                        scale: scal,
                                        src: 'img/image/'+ity+aity+'.png'
                                    })
                                });
                                feature.setStyle(rpointStyle);
                            }
                        });
                    }
                });
                $('#bchart').remove();
            }
        }
        if (feature !== undefined) {
            $('#bchart').remove();
            $('#pbchart').append('<canvas id="bchart"></canvas>');
            const curzm = viewObj.getZoom();
            var zoomto = 10;
            if (curzm > zoomto) {
                zoomto = curzm;
            }
            services.sens_clicked = feature.id_;
            services.senstype_clicked = layername; 
            const redpinStyle = new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    scale: 0.17,
                    src: 'img/image/pin-blue.png'
                })
            });
            feature.setStyle(redpinStyle);
            viewObj.animate({
                center: feature.getGeometry().getCoordinates(),
                zoom: zoomto,
                duration: 1000
            });
            var labels = d2ts.map(function(e) {
                return e.time;
            });
            var data = d2ts.map(function(e) {
                return e.value;
            });
            var ctx = document.getElementById('bchart').getContext('2d');
            var config = {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: layername,
                        data: data,
                        fill: false,
                        borderColor: '#4bc0c0',
                        borderWidth: 2,
                        backgroundColor: 'rgba(0, 0, 0, 0)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }],
                        xAxes: [{
                            type: 'time',
                            ticks: {
                                maxTicksLimit: 3.1,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        }]
                    },
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'xy'
                            },
                            zoom: {
                                enabled: true,
                                mode: 'x'
                            }
                        }
                    }
                }
            };
            $("#loadingchart").hide();
            var chart = new Chart(ctx, config);
        }
    }
    services.getGeoJson = function() {
        var geom = [];
        pointsource.forEachFeature( function(feature) { geom.push(new ol.Feature(feature.getGeometry().clone())); } );
        var writer = new ol.format.GeoJSON();
        const geoJsonStr = writer.writeFeatures(geom);
        const coord = geom[0].values_.geometry.flatCoordinates;
        return [geoJsonStr, coord];
    }
    services.interactionFinished = function() {
        mapObj.removeInteraction(draw);
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('name') != undefined && layer.get('name') === 'tempolygon') {
                mapObj.removeLayer(layer);
            }
        });
    }
    return services;
})
.directive('ngMap', ['mapService', '$http', function (mapService, $http) {
    return {
        restrict: 'A',
        replace: true,
        link: function ($scope) {
            var view = new ol.View({
                projection: 'EPSG:4326',
                center: [120, -1.5],
                zoom: 5
            })
            var map = new ol.Map({
                target: 'map',
                controls : ol.control.defaults({
                    attribution : false
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
            map.on("click", function(e) {
                var wclk = 0;
                map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                    const lyrnm = layer.get('name');
                    const lyrty = lyrnm.split('_')[0];
                    if (lyrty == 'predTsu' || lyrty == 'EQ') {
                        $http({
                            method : "GET",
                            url : "/user/webgis/getInfoDetail",
                            params : {fid: feature.id_, type: lyrty}
                        }).then(function querySuccess(response) {
                            var temp = {}
                            response.data.typeid = lyrty;
                            if (lyrty == 'predTsu') {
                                temp.type = 'Potensi Tsunami';
                                temp.data = response.data;
                            }
                            else if (lyrty == 'EQ') {
                                temp.type = 'Gempa';
                                temp.data = response.data;
                            }
                            angular.copy(temp, mapService.info_detail);
                            console.log(mapService.info_detail.data);
                            mapService.selectHS(feature, lyrnm);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                        wclk = 1;
                    }
                    else if (lyrty == 'GNSS') {
                        console.log(lyrnm);
                        $("#chartarea").show();
                        $("#loadingchart").show();
                        const dlvl = feature.getProperties()['diff'];
                        const ltime = feature.getProperties()['ltime'];
                        const snid = lyrnm.split('_');
                        console.log(snid[snid.length - 1]);
                        if (dlvl=='warn' || dlvl=='normal') {
                            $http({
                                method : "GET",
                                url : "/user/webgis/getSensorDetail",
                                params : {locid: feature.id_, timid: ltime, senid: snid[snid.length - 1], intvl: 10}
                            }).then(function querySuccess(response) {
                                mapService.sensorDetail(feature, lyrnm, response.data);
                            }, function queryError(response) {
                                console.log('connection failed');
                            });
                            wclk = 1;
                        }
                        else {
                            wclk = 0;
                        }
                    }
                });
                if (wclk == 0) {
                    $("#chartarea").hide();
                    mapService.selectHS(undefined, undefined);
                    mapService.sensorDetail(undefined, undefined);
                    mapService.hs_clicked = undefined;
                    mapService.sens_clicked = undefined;
                    mapService.type_clicked = undefined;
                    mapService.senstype_clicked = undefined;
                }
            });
            $('#map').data('map', map);
            mapService.mapInit(map, view);
        }
    };
}]);
