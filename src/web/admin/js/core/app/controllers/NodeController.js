/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodeController', ['$scope', '$controller', '$rootScope', '$routeParams', '$location', '$timeout', '$logger', '$q', '$data', '$route', '$jsnbt', 'ScrollSpyService', '$fn', 'LocationService', 'AuthService', 'DATA_EVENTS', 'CONTROL_EVENTS',
            function ($scope, $controller, $rootScope, $routeParams, $location, $timeout, $logger, $q, $data, $route, $jsnbt, ScrollSpyService, $fn, LocationService, AuthService, DATA_EVENTS, CONTROL_EVENTS) {

                $controller('NodeFormControllerBase', $scope.base);

                $scope.init();

        }]);
})();