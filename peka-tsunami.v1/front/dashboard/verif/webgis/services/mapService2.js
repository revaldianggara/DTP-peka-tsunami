angular.module("mapService", [])
.factory('mapService', function($timeout) {
    var mapObj;
    var draw;
    var pointsource;
    var vector;
    var services = {};
    services.hs_clicked = undefined;
    services.type_clicked = undefined;
    services.info_window = [];
    const pinpointStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 250],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            scale: 0.1,
            src: 'img/image/pin.png'
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
    services.drawHS = function (idn, gjson) {
        if (gjson.features == null) {
            console.log("Not Found!");
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
            else if (idt == 'Veg') {
                ity = 't';
            }
            var hssource = new ol.source.Vector({
                features: (new ol.format.GeoJSON()).readFeatures(gjson)
            });
            console.log(gjson.features.length);
            hssource.forEachFeature(function(feature){
                const rpointStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0.5, 5],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        scale: 0.05,
                        src: 'img/image/'+ity+'.png'
                    })
                });
                feature.setStyle(rpointStyle);
            });
            var hsvector = new ol.layer.Vector({source: hssource});
            hsvector.set('name', idn);
            mapObj.addLayer(hsvector);
        }
    }
    services.addRasterLayer = function(rast2add, nuid) {
        var uraster = new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: rast2add
            })
        });
        uraster.set('name', 'rastername');
        uraster.set('id', nuid);
        //mapObj.getLayers().insertAt(mapObj.getLayers().getArray().length-2, uraster);
        mapObj.addLayer(uraster);
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
    services.changeLayerSource = function(slcrast, nuid) {
        const xyzurl = translateUrl(slcrast);
        console.log(nuid);
        var usource = new ol.source.XYZ({
            url: xyzurl,
            projection: 'EPSG:4326'
        })
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('id') == nuid) {
                console.log(layer.get('id'));
                layer.setSource(usource);
            }
        });
    }
    services.selectHS = function (pcoord, respons) {
        var eck = 0;
        services.info_window.unshift(respons);
        /* services.info_window.forEach(function (rsps) {
            if (rsps.peid == respons.peid) {
                eck = 1;
                console.log('popup exists');
            }
        });
        if (eck == 0) {
            services.info_window.unshift(respons);
        } */
        $timeout(function () {
            var tgtdiv = document.getElementById(respons.peid);
            console.log(tgtdiv);
            var overlay = new ol.Overlay({
                element: tgtdiv,
                positioning: 'bottom-center',
                autoPan: true,
                autoPanAnimation: {
                    duration: 250,
                },
            });
            overlay.set('name', respons.peid);
            overlay.setPosition(pcoord);
            mapObj.addOverlay(overlay);
        }, 100);
    }
    services.removePopup = function (popid) {
        mapObj.getOverlays().forEach(function (overlay) {
            const ovrnm = overlay.get('name');
            if (ovrnm == popid) {
                console.log('remove '+ovrnm);
                mapObj.removeOverlay(overlay);
            }
        })
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
                center: [113, -1.5],
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
                    /* new ol.layer.Tile({
                        source: new ol.source.BingMaps({
                            name: 'basemap',
                            id: 99999,
                            key: 'ApxKj5A4BjgMqT3O0s8xDQ8-KBoe51FaaiX4er38T5gyKVcJRjJJgaKRZhor7o_F',
                            imagerySet: 'AerialWithLabelsOnDemand'
                        })
                    })*/
                ],
                view: view
            });
            map.on("click", function(e) {
                map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
                    const lyrnm = layer.get('name');
                    const lyrty = lyrnm.split('_')[0];
                    if (lyrty == 'predTsu' || lyrty == 'EQ') {
                        $http({
                            method : "GET",
                            url : "/user/webgis/getInfoDetail",
                            params : {fid: feature.id_, type: lyrty}
                        }).then(function querySuccess(response) {
                            response.data.typeid = lyrty;
                            var temp = {};
                            if (lyrty == 'predTsu') {
                                temp.type = 'Potensi Tsunami';
                            }
                            else if (lyrty == 'EQ') {
                                temp.type = 'Gempa';
                            }
                            response.data.peid = lyrnm + '_' + feature.id_;
                            const pcrd = feature.getGeometry().getCoordinates();
                            mapService.selectHS(pcrd, response.data);
                        }, function queryError(response) {
                            console.log('connection failed');
                        });
                    }
                });
            });
            $('#map').data('map', map);
            mapService.mapInit(map, view);
        }
    };
}]);
