/* global angular:false */

(function () {
    "use strict";
    
    jsnbt.TreeControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

        var logger = $logger.create('TreeControllerBase');

        $scope.domain = $route.current.$$route.domain;
        $scope.entities = $route.current.$$route.entities;
        $scope.cacheKey = $route.current.$$route.cacheKey;

        $scope.nodes = [];

        $scope.tmpl = $route.current.$$route.tmpl;

        $scope.load = function () {
            var deferred = $q.defer();

            TreeNodeService.getNodes({
                identifier: $scope.cacheKey,
                domain: $scope.domain,
                entities: $scope.entities,
                parentId: '',
                parentIds: []
            }).then(function (response) {
                deferred.resolve(response);
            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.set = function (data) {
            $scope.nodes = data;
        };

        $scope.back = function () {
            throw new Error('not implemented');
        };

        $scope.canCreate = function () {
            return false;
        };

        $scope.create = function () {
            throw new Error('not implemented');
        };

        $scope.remove = function (node) {
            if (node.parent.id === '') {
                $scope.nodes[0].children = _.filter($scope.nodes[0].children, function (x) { return x.id !== node.id; });
                $scope.nodes[0].childCount = $scope.nodes[0].children.length;
            }
            else {
                node.parent.children = _.filter(node.parent.children, function (x) { return x.id !== node.id; });
                node.parent.childCount = node.parent.children.length;

                if (node.parent.childCount === 0)
                    node.parent.collapsed = true;
            }
        };

        $scope.treeFn = {

            canCreate: function (node) {
                throw new Error('not implemented');
            },

            create: function (node) {
                throw new Error('not implemented');
            },

            canEdit: function (node) {
                throw new Error('not implemented');
            },

            edit: function (node) {
                throw new Error('not implemented');
            },

            canDelete: function (node) {
                throw new Error('not implemented');
            },

            delete: function (node) {
                throw new Error('not implemented');
            },

            canOpen: function (node) {
                throw new Error('not implemented');
            },

            open: function (node) {
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

    angular.module("jsnbt")
        .controller('TreeControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.TreeControllerBase]);
})();