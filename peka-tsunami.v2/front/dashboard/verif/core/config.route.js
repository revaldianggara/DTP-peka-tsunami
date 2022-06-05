(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function ($routeProvider) {
            var routes, setRoutes;

            routes = [
                'layer-control/dashboard', 'layer-control/verifikasi', 'layer-control/bantuan'
            ]

            setRoutes = function (route) {
                var config, url;
                url = '/' + route;
                config = {
                    templateUrl: route + '.html'
                };
                $routeProvider.when(url, config);
                return $routeProvider;
            };

            routes.forEach(function (route) {
                return setRoutes(route);
            });

            $routeProvider
                .when('/', {
                    redirectTo: 'layer-control/dashboard'
                })
                .when('/dashboard', {
                    templateUrl: 'layer-control/dashboard.html'
                })
                .when('/404', {
                    templateUrl: 'layer-control/404.html'
                })
                .otherwise({
                    redirectTo: '/404'
                });

        }]);

})();