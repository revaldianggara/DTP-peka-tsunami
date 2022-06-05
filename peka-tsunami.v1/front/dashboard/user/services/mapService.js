angular.module("mapService", [])
.factory('mapService', function($mdSidenav) {
    var mapObj;
    var viewObj;
    var vector;
    var services = {};
    services.mapInit = function (mapobj, viewobj) {
        mapObj = mapobj;
        viewObj = viewobj;
    }
    services.drawPol = function (gjson) {
        var layersToRemove = [];
        mapObj.getLayers().forEach(function (layer) {
            if (layer.get('name') != undefined) {
                layersToRemove.push(layer);
            }
        });
        var len = layersToRemove.length;
        for(var i = 0; i < len; i++) {
            mapObj.removeLayer(layersToRemove[i]);
        }
        var polsource = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(gjson)
        });
        var vector = new ol.layer.Vector({source: polsource});
        vector.set('name', 'tempolygon');
        mapObj.addLayer(vector);
        vector.setZIndex(9999);
    }
    services.removePol = function (idn) {
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
    return services;
})
.directive('ngMap', ['mapService', '$http', function (mapService, $http) {
    return {
        restrict: 'A',
        replace: true,
        link: function ($scope) {
            var view = new ol.View({
                projection: 'EPSG:4326',
                center: [119, -1.5],
                zoom: 5
            })
            var map = new ol.Map({
                target: 'map',
                controls : ol.control.defaults({
                    attribution : false
                }),
                layers: [
                    new ol.layer.Tile({
                        source: new ol.source.OSM()
                    })
                    /*new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            url: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
                        })
                    })*/
                    /* new ol.layer.Tile({
                        source: new ol.source.BingMaps({
                            name: 'basemap',
                            id: 99999,
                            key: 'ApxKj5A4BjgMqT3O0s8xDQ8-KBoe51FaaiX4er38T5gyKVcJRjJJgaKRZhor7o_F',
                            imagerySet: 'AerialWithLabelsOnDemand'
                        })
                    }) */
                ],
                view: view
            });
            $('#map').data('map', map);
            mapService.mapInit(map, view);
        }
    };
}]);
