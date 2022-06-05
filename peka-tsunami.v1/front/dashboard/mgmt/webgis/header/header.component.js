'use strict';

angular.
    module('header').
    component('header', {
        templateUrl: 'header/header.template.html',
        controller: function headerController($scope) {
            console.log('header on');
            $scope.showGuideDownload = function ($mdMenu, ev) {
                $mdMenu.open(ev);
            }
        }
});
