/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TreeControllerBase', ['$scope', '$controller', '$route', '$rootScope', '$routeParams', '$location', '$data', '$q', '$timeout', '$jsnbt', '$fn', 'AuthService', 'TreeNodeService', 'LocationService', 'ScrollSpyService', 'ModalService', 'DATA_EVENTS', 'CONTROL_EVENTS',
            function ($scope, $controller, $route, $rootScope, $routeParams, $location, $data, $q, $timeout, $jsnbt, $fn, AuthService, TreeNodeService, LocationService, ScrollSpyService, ModalService, DATA_EVENTS, CONTROL_EVENTS) {

                $scope.domain = $route.current.$$route.domain;
                $scope.entities = $route.current.$$route.entities || [];
                $scope.cacheKey = $route.current.$$route.cacheKey;

                $scope.text = {
                    title: 'nodes',
                    empty: 'no nodes'
                };

                $scope.nodes = [];

                var fn = {

                    load: function () {
                        var deferred = $q.defer();

                        TreeNodeService.getNodes({
                            identifier: $scope.cacheKey,
                            domain: $scope.domain,
                            entitiy: $scope.entities,
                            parentId: '',
                            parentIds: []
                        }).then(function (response) {
                            deferred.resolve(response);
                        }, function (error) {
                            deferred.reject(error);
                        });

                        return deferred.promise;
                    },

                };


                $scope.back = function () {
                    throw new Error('not implemented');
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

                    fn.load().then(function (response) {
                        $scope.nodes = response;

                        deferred.resolve();
                    }, function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

              

            }]);
})();