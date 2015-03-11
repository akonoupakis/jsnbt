;(function () {
    "use strict";

    angular.module("jsnbt-addon-location")
        .controller('LocationController', function ($scope, $location, $rootScope, $route, $logger, $q, $data, TreeNodeService, $fn, LocationService, ModalService) {

            var logger = $logger.create('LocationController');

            $scope.domain = 'location';
            $scope.nodes = [];


            var fn = {

                load: function () {
                    var deferred = $q.defer();

                    TreeNodeService.getNodes({
                        identifier: 'content:location:nodes',
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

                create: function (parent) {
                    var deferred = $q.defer();

                    ModalService.open({
                        title: 'type a name',
                        controller: 'LocationNamePromptController',
                        template: 'tmpl/location/modals/namePrompt.html'
                    }).then(function (result) {
                        
                        if (!!result.name && result.name !== '') {
                            
                            $data.nodes.post($data.create('nodes', {
                                domain: 'location',
                                name: result.name,
                                entity: result.entity,
                                parent: parent,
                            })).then(function (nodeResult) {
                                deferred.resolve(nodeResult);
                            }, function (error) {
                                deferred.reject(error);
                            });

                        }
                    });

                    return deferred.promise;
                }

            };


            $scope.back = function () {
                $location.previous('/modules');
            };

            $scope.create = function () {
                fn.create('').then(function (result) {
                    $location.next('/modules/location/nodes/' + (result.entity === 'location-category' ? '' : 'location/') + result.id);
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.treeFn = {

                canCreate: function (node) {
                    return node.entity === 'location-category';
                },

                create: function (node) {
                    fn.create(node.id).then(function (result) {
                        $location.next('/modules/location/nodes/' + (result.entity === 'location-category' ? '' : 'location/') + result.id);
                    }, function (ex) {
                        logger.error(ex);
                    });
                },

                canEdit: function (node) {
                    return true;
                },

                edit: function (node) {
                    $location.next('/modules/location/nodes/' + (node.entity === 'location-category' ? '' : 'location/') + node.id);
                },

                canDelete: function (node) {
                    return node.childCount === 0;
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
                                throw nodeDeleteError;
                            });
                        }
                    });
                }

            };

            fn.load().then(function (response) {
                $scope.nodes = response;
            }, function (ex) {
                logger.error(ex);
            });
            
        });
})();