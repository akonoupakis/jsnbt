/* global angular:false */

(function () {
    "use strict";

    jsnbt.FormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('FormControllerBase');
        
        $scope.id = $routeParams.id;
        $scope.new = $scope.id === 'new' || _.str.startsWith($scope.id, 'new-');
        $scope.name = undefined;

        $scope.valid = true;

        $scope.published = true;
        $scope.draft = false;

        $scope.isNew = function () {
            return $scope.new;
        };

        $scope.set = function (data) {
            throw new Error('not implemented');
        };

        $scope.get = function () {
            throw new Error('not implemented');
        };

        $scope.setName = function (name) {
            $scope.name = name;
        };

        $scope.setLocation = function () {
            var breadcrumb = LocationService.getBreadcrumb();
            breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
            if ($scope.new) {
                breadcrumb.push({
                    name: 'new',
                    active: true
                });
            }
            else {
                breadcrumb.push({
                    name: $scope.name,
                    active: true
                });
            }

            $scope.current.setBreadcrumb(breadcrumb);
        };

        $scope.setSpy = function (time) {
            ScrollSpyService.get(time || 0).then(function (response) {
                $scope.nav = response;
            });
        };

        $scope.setValid = function (value) {
            $scope.valid = value;
        };

        $scope.isValid = function () {
            return $scope.valid;
        };

        $scope.setPublished = function (value) {
            $scope.published = value;
            $scope.draft = !value;
        };

        $scope.validate = function () {
            $scope.setValid(true);
            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
        };

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

        $scope.discard = function () {
            throw new Error('not implemented');
        };

        $scope.publish = function () {
            throw new Error('not implemented');
        };

        $scope.$watch('name', function (newValue, prevValue) {
            $scope.setLocation();
        });

        $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
            sender.stopPropagation();

            $scope.published = false;
        });

        $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
            sender.stopPropagation();

            if (!value)
                $scope.valid = false;
        });

        $scope.init = function () {
            var deferred = $q.defer();

            deferred.resolve();

            return deferred.promise;
        };

    };
    jsnbt.FormControllerBase.prototype = Object.create(jsnbt.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('FormControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.FormControllerBase]);
})();