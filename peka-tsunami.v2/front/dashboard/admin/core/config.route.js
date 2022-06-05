(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function ($routeProvider) {
            var routes, setRoutes;

            routes = [
                'layer-control/pengguna', 'layer-control/hwstats', 'layer-control/monitoring', 'layer-control/bantuan'
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
                    redirectTo: 'layer-control/pengguna'
                })
                .when('/pengguna', {
                    templateUrl: 'layer-control/pengguna.html'
                })
                .when('/404', {
                    templateUrl: 'layer-control/404.html'
                })
                .otherwise({
                    redirectTo: '/404'
                });

        }]);

})();