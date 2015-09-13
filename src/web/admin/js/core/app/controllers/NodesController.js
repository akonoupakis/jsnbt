/* global angular:false */

(function () {
    "use strict";
    
    var NodesController = function ($scope, $location, $jsnbt, $fn, $data, ModalService) {
        jsnbt.TreeControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.domain = 'core';
        $scope.cacheKey = 'content:nodes';
        
        $scope.back = function () {
            $location.previous('/content');
        };

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

                if (node.domain === 'core' && node.entity !== 'pointer') {
                    return $jsnbt.entities[node.entity].parentable;
                }

                return false;
            },

            create: function (node) {
                var targetEntity = $jsnbt.entities[node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity];
                if (node.domain === 'core' && node.entity === 'pointer') {
                    $data.nodes.get(node.pointer.nodeId).then(function (response) {
                        $location.next(targetEntity.getCreateUrl(response));
                    }, function (ex) {
                        throw ex;
                    });
                }
                else {
                    $location.next(targetEntity.getCreateUrl(node));
                }
            },

            canEdit: function (node) {
                return $jsnbt.entities[node.entity].editable;
            },

            edit: function (node) {
                var editUrl = $jsnbt.entities[node.entity].getEditUrl(node);
                $location.next(editUrl);
            },

            canDelete: function (node) {
                if (node.domain === 'core') {
                    return $jsnbt.entities[node.entity].deletable;
                }
                else {
                    return false;
                }
            },

            delete: function (node) {
                ModalService.open({
                    title: 'are you sure you want to permanently delete the node ' + node.name + '?',
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
                        $location.next(targetEntity.getViewUrl(response));
                    }, function (ex) {
                        throw ex;
                    });
                }
                else {
                    $location.next(targetEntity.getViewUrl(node));
                }
            }

        };

        $scope.init();

    };
    NodesController.prototype = Object.create(jsnbt.TreeControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodesController', ['$scope', '$location', '$jsnbt', '$fn', '$data', 'ModalService', NodesController]);
})();