angular.module('ngFile', [])
	.directive('ngFileUpload', function(httpPostFactory) {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
            element.bind('change', function() {
                var formData = new FormData();
                formData.append('file', element[0].files[0]);

                // optional front-end logging 
                var fileObject = element[0].files[0];
                scope.fileLog = {
                    'lastModified': fileObject.lastModified,
                    'lastModifiedDate': fileObject.lastModifiedDate,
                    'name': fileObject.name,
                    'size': fileObject.size,
                    'type': fileObject.type
                };
                scope.$apply();

                /*  ---> post request to your php file and use $_FILES in your php file   < ----
                httpPostFactory('your_upload_image_php_file.php', formData, function (callback) {
                    console.log(callback);
                });
                */
            });
        }
    };
})

.factory('httpPostFactory', function($http) {
    return function(file, data, callback) {
        $http({
            url: file,
            method: "POST",
            data: data,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(response) {
            callback(response);
        });
    };
});