/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodesController', function ($scope, $location, $rootScope, $route, $logger, $q, $data, TreeNodeService, $fn, LocationService, ModalService) {
            
            var logger = $logger.create('NodesController');

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

            };


            $scope.back = function () {
                $location.previous('/content');
            };

            $scope.create = function () {
                $location.next($fn.invoke('core', 'getCreateUrl'));
            };

            $scope.treeFn = {

                canCreate: function (node) {
                    return node.domain === 'core' && node.entity !== 'pointer';
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

            fn.load().then(function (response) {
                $scope.nodes = response;
            }, function (ex) {
                logger.error(ex);
            });

        });
})();