/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodesController', function ($scope, $location, $rootScope, $route, $logger, $q, $data, TreeNodeService, $fn, LocationService) {
            
            var logger = $logger.create('TextsController');

            $scope.domain = 'core';
            $scope.nodes = [];
            

            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    TreeNodeService.getNodes({
                        identifier: 'content:nodes',
                        domain: $scope.domain,
                        parentId: '',
                        parentIds: []
                    }).then(function (response) {
                        deferred.resolve(response);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                create: function () {
                    var deferred = $q.defer();

                    $fn.invoke('core', 'tree.create', [undefined]).then(function (result) {
                        deferred.resolve(result);
                        $location.next('/content/nodes/' + result.id);
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                getDomain: function (node) {
                    if (node.entity === 'pointer')
                        return node.pointer.domain;

                    return node.domain;
                }

            };


            $scope.back = function () {
                $location.previous('/content');
            };

            $scope.create = function () {
                fn.create().then(function (result) {
                    $location.next('/content/nodes/' + result.id);
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.treeFn = {

                canCreate: function (node) {
                    return $fn.invoke(node.domain, 'tree.canCreate', [node]);
                },

                create: function (node) {
                    $fn.invoke(fn.getDomain(node), 'tree.create', [node]);
                },

                canEdit: function (node) {
                    return node.editUrl && node.editUrl !== '';
                },

                edit: function (node) {
                    $location.next(node.editUrl);
                },

                canDelete: function (node) {
                    return $fn.invoke(fn.getDomain(node), 'tree.canDelete', [node]);
                },

                delete: function (node) {
                    $fn.invoke(fn.getDomain(node), 'tree.delete', [node]).then(function (deleted) {
                        if (deleted) {
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
                        }
                    }, function (ex) {
                        throw ex;
                    });
                },

                canPublish: function (node) {
                    return node.draft || !node.published;
                },

                publish: function (node) {
                    $location.next(node.editUrl);
                },

                canOpen: function (node) {
                    return node.viewUrl && node.viewUrl !== '';
                },

                open: function (node) {
                    $location.next(node.viewUrl);
                }

            };

            fn.load().then(function (response) {
                $scope.nodes = response;
            }, function (ex) {
                logger.error(ex);
            });

        });
})();