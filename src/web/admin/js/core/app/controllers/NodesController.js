/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodesController', ['$scope', '$controller', '$location', '$fn', '$data', 'ModalService',
            function ($scope, $controller, $location, $fn, $data, ModalService) {

                $controller('TreeControllerBase', $scope.base);
                
                $scope.$parent.domain = 'core';
                $scope.$parent.entities = [];
                $scope.$parent.cacheKey = 'content:nodes';

                $scope.back = function () {
                    $location.previous('/content');
                };

                $scope.create = function () {
                    $location.next($fn.invoke($scope.domain, 'getCreateUrl'));
                };

                $scope.treeFn = {

                    canCreate: function (node) {
                        return node.domain === 'core' && node.entity !== 'pointer' && node.entity !== 'router';
                    },

                    create: function (node) {
                        $location.next($fn.invoke(node.domain, 'getCreateUrl', [node]));
                    },

                    canEdit: function (node) {
                        var editUrl = $fn.invoke(node.domain, 'getEditUrl', [node]);
                        return editUrl && editUrl !== '';
                    },

                    edit: function (node) {
                        var editUrl = $fn.invoke(node.domain, 'getEditUrl', [node]);
                        $location.next(editUrl);
                    },

                    canDelete: function (node) {
                        if (node.domain === 'core') {
                            if (node.entity !== 'pointer' && node.childCount !== 0)
                                return false;
                        }
                        else {
                            return false;
                        }

                        return true;
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
                        var domain = node.domain === 'core' && node.entity == 'pointer' ? node.pointer.domain : 'core';
                        var viewUrl = $fn.invoke(domain, 'getViewUrl', [node]);
                        return viewUrl && viewUrl !== '';
                    },

                    open: function (node) {
                        var domain = node.domain === 'core' && node.entity == 'pointer' ? node.pointer.domain : 'core';
                        var viewUrl = $fn.invoke(domain, 'getViewUrl', [node]);
                        $location.next(viewUrl);
                    }

                };

                $scope.init();

            }]);
})();