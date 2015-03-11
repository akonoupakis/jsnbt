;(function () {
    "use strict";
    
    angular.module("jsnbt-addon-location", ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider.
            when('/modules/location', {
                redirectTo: '/modules/location/nodes'
            })
            .when('/modules/location/nodes', {
                templateUrl: 'tmpl/location/pages/main.html',
                controller: 'LocationController'
            })
            .when('/modules/location/nodes/:id', {
                templateUrl: 'tmpl/core/pages/content/node.html',
                controller: 'NodeController'
            })
            .when('/modules/location/nodes/location/:id', {
                templateUrl: 'tmpl/core/pages/content/node.html',
                controller: 'NodeController',
                tmpl: 'tmpl/location/specs/location.html'
            });
    })
    .run(function ($rootScope, $location, $route, $fn, LocationFunctionService) {
        $fn.register('location', LocationFunctionService);
    });
})();