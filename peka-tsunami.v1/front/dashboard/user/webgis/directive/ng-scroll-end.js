'use strict';
angular.module('ng-scroll-end', []).directive('ngScrollEnd', ['$document', '$timeout', function ($document, $timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var ele = element[0];
            element.bind("scroll", function () {
                if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight) {
                    scope.$apply(attrs.ngScrollEnd);
                }
            });
        }
    };
}]);