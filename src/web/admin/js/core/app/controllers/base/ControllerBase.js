/* global angular:false */

(function () {
    "use strict";

    jsnbt.ControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        
        $scope.domain = $route.current.$$route.domain;

        $scope.back = function () {
            $scope.current.breadcrumb.pop();
            var lastItem = _.last($scope.current.breadcrumb);
            if (lastItem) {
                $location.previous(lastItem.url);
            }
            else {
                throw new Error('not implemented');
            }
        };

        $scope.goto = function (path) {
            $location.goto(path);
        };

        $scope.previous = function (path) {
            $location.previous(path);
        };

        $scope.next = function (path) {
            $location.next(path);
        };

    };

    angular.module("jsnbt")
        .controller('ControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.ControllerBase]);
})();