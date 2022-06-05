(function () {
        'use strict';

        angular.module('layerControl')
                .directive('uiRangeSlider', uiRangeSlider)
                .directive('uiFileUpload', uiFileUpload)
                .directive('uiWizardForm', uiWizardForm);

        // Dependency: http://www.eyecon.ro/bootstrap-slider/ OR https://github.com/seiyria/bootstrap-slider
        function uiRangeSlider() {
                return {
                        restrict: 'A',
                        link: function (scope, ele) {
                                ele.slider();
                        }
                }
        }

        // Dependency: https://github.com/grevory/bootstrap-file-input
        function uiFileUpload() {
                return {
                        restrict: 'A',
                        link: function (scope, ele) {
                                ele.bootstrapFileInput();
                        }
                }
        }

        // Dependency: https://github.com/rstaib/jquery-steps
        function uiWizardForm() {
                return {
                        restrict: 'A',
                        link: function (scope, ele) {
                                ele.steps()
                        }
                }
        }

})();