/* global angular:false */

(function () {
    "use strict";
    
    jsnbt.ListControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('ListControllerBase');

        $scope.data = {};

        $scope.tmpl = $route.current.$$route.tmpl;

        $scope.load = function () {
            throw new Error('not implemented');
        };

        $scope.set = function (data) {
            $scope.data = data;
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

        $scope.canCreate = function () {
            return false;
        };

        $scope.create = function () {
            throw new Error('not implemented');
        };

        $scope.remove = function (item) {
            $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== item.id; });
        };

        $scope.setLocation = function () {
            var deferred = $q.defer();

            var breadcrumb = LocationService.getBreadcrumb();

            $scope.current.setBreadcrumb(breadcrumb);

            deferred.resolve(breadcrumb);

            return deferred.promise;
        };

        $scope.gridFn = {

            canEdit: function (item) {
                throw new Error('not implemented');
            },

            edit: function (item) {
                throw new Error('not implemented');
            },

            canDelete: function (item) {
                throw new Error('not implemented');
            },

            delete: function (item) {
                throw new Error('not implemented');
            },

            canOpen: function (item) {
                throw new Error('not implemented');
            },

            open: function (item) {
                throw new Error('not implemented');
            }

        };

        $scope.init = function () {
            var deferred = $q.defer();

            $scope.load().then(function (response) {
                $scope.set(response);
                deferred.resolve(response);
            }, function (ex) {
                logger.error(ex);
                deferred.reject(ex);
            });

            return deferred.promise;
        };

    };
    jsnbt.ListControllerBase.prototype = Object.create(jsnbt.ControllerBase.prototype);

    angular.module("jsnbt")
        .controller('ListControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.ListControllerBase]);
})();