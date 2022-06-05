'use strict';

angular.module('untitled', [
    'ngMaterial',
    'ngMessages',
    'header',
    'ng-scroll-end',
    'layerControl'
])
.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('grey', {
            'default': '300',
            'hue-1': '500',
            'hue-2': '200',
    });
    $mdThemingProvider.alwaysWatchTheme(true);
});