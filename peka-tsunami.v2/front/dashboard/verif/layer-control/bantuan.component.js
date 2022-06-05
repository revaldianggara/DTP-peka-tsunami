(function () {
        'use strict';

        angular.module('layerControl')
                .directive('uiRangeSlider', uiRangeSlider)
                .directive('uiFileUpload', uiFileUpload)
                .directive('uiWizardForm', uiWizardForm);

        function uiRangeSlider() {
                return {
                        restrict: 'A',
                        link: function (scope, ele) {
                                ele.slider();
                        }
                }
        }

        function uiFileUpload() {
                return {
                        restrict: 'A',
                        link: function (scope, ele) {
                                ele.bootstrapFileInput();
                        }
                }
        }

        function uiWizardForm() {
                return {
                        restrict: 'A',
                        link: function (scope, ele) {
                                ele.steps()
                        }
                }
        }

})();