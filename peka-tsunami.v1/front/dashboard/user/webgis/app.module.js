'use strict';

angular.module('untitled', [
    'ngMaterial',
    'ngMessages',
    'header',
    'ng-slide-down',
    'ng-scroll-end',
    'layerControl',
    'mapService'
])
.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();   
        return year + '/' + (monthIndex + 1) + '/' + day;  
    };
});