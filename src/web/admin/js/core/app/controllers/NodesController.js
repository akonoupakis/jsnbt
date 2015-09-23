/* global angular:false */

(function () {
    "use strict";
    
    var NodesController = function ($scope, $location, $jsnbt, $fn, $data, ModalService) {
        jsnbt.TreeControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.domain = 'core';
        $scope.cacheKey = 'content:nodes';
        $scope.prefix = '/content/nodes';
        $scope.offset = 2;
    
        $scope.canCreate = function () {
            return true;
        };

        $scope.create = function () {
            $location.next('/content/nodes/new');
        };

        $scope.treeFn = {

            canCreate: function (node) {
                if (node.domain === 'core' && node.entity === 'router')
                    return false;

                if (node.domain === 'core') {
                    if (node.entity === 'pointer') {
                        return $jsnbt.entities[node.pointer.entity].parentable;
                    }
                    else {
                        return $jsnbt.entities[node.entity].parentable;
                    }
                }
                else {
                    if ($jsnbt.entities[node.entity].parentable) {
                        return true;
                    }
                }

                return false;
            },

            create: function (node) {
                var targetEntity = $jsnbt.entities[node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity];
                if (node.domain === 'core' && node.entity === 'pointer') {
                    $location.next($jsnbt.entities[node.pointer.entity].getCreateUrl({
                        id: node.pointer.nodeId
                    }, $scope.prefix));
                }
                else {
                    $location.next(targetEntity.getCreateUrl(node, $scope.prefix));
                }
            },

            canEdit: function (node) {
                return $jsnbt.entities[node.entity].editable;
            },

            edit: function (node) {
                var editUrl = $jsnbt.entities[node.entity].getEditUrl(node, $scope.prefix);
                $location.next(editUrl);
            },

            canDelete: function (node) {
                if (node.domain === 'core') {
                    return $jsnbt.entities[node.entity].deletable && node.childCount === 0;
                }
                else {
                    return false;
                }
            },

            delete: function (node) {
                $data.nodes.get({
                    hierarchy: node.id,
                    id: {
                        $ne: [node.id]
                    },
                    $limit: 1
                }).then(function (nodes) {

                    if (nodes.length > 0) {

                        ModalService.open({
                            title: 'oops',
                            message: 'this node is not empty and cannot be deleted',
                            controller: 'ErrorPromptController',
                            template: 'tmpl/core/modals/errorPrompt.html',
                            btn: {
                                ok: 'ok',
                                cancel: false
                            }
                        }).then(function (result) {

                        });

                    }
                    else {

                        ModalService.open({
                            title: 'are you sure you want to permanently delete the node ' + node.title[$scope.defaults.language] + '?',
                            controller: 'DeletePromptController',
                            template: 'tmpl/core/modals/deletePrompt.html'
                        }).then(function (result) {
                            if (result) {
                                $data.nodes.del(node.id).then(function (nodeDeleteResults) {
                                    $scope.remove(node);
                                }, function (nodeDeleteError) {
                                    deferred.reject(nodeDeleteError);
                                });
                            }
                        });
                    }

                }).catch(function (ex) {
                    deferred.reject(ex);
                });
            },

            canOpen: function (node) {
                var targetEntity = node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity;
                if (targetEntity) {
                    return $jsnbt.entities[targetEntity].viewable;
                }
                else {
                    return false;
                }
            },

            open: function (node) {
                var targetEntity = $jsnbt.entities[node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity];
                if (node.domain === 'core' && node.entity === 'pointer') {
                    $data.nodes.get(node.pointer.nodeId).then(function (response) {
                        $location.next(targetEntity.getViewUrl(response, $scope.prefix));
                    }, function (ex) {
                        throw ex;
                    });
                }
                else {
                    $location.next(targetEntity.getViewUrl(node, $scope.prefix));
                }
            }

        };

        $scope.init();

    };
    NodesController.prototype = Object.create(jsnbt.TreeControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodesController', ['$scope', '$location', '$jsnbt', '$fn', '$data', 'ModalService', NodesController]);
})();