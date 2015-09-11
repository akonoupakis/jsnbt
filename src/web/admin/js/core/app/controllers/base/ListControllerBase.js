/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ListControllerBase', ['$scope', '$controller', '$route', '$rootScope', '$routeParams', '$location', '$data', '$logger', '$q', '$timeout', '$jsnbt', '$fn', 'AuthService', 'TreeNodeService', 'LocationService', 'ScrollSpyService', 'ModalService', 'DATA_EVENTS', 'CONTROL_EVENTS',
            function ($scope, $controller, $route, $rootScope, $routeParams, $location, $data, $logger, $q, $timeout, $jsnbt, $fn, AuthService, TreeNodeService, LocationService, ScrollSpyService, ModalService, DATA_EVENTS, CONTROL_EVENTS) {
           
            $scope.data = {};
          
            $scope.set = function (data) {
                $scope.data = data;
            };

            $scope.remove = function (itemId) {
                $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== itemId; });
            };

        }]);
})();