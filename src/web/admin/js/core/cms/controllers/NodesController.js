/* global angular:false */

(function () {
    "use strict";
    
    var NodesController = function ($scope, $rootScope, $jsnbt, $logger, $data, ModalService, AuthService) {
        jsnbt.controllers.TreeControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;
        
        var logger = $logger.create('NodesController');

        $scope.cacheKey = ($scope.modal ? 'modal:' : '') +  'content:nodes';
    
        $scope.canCreate = function () {
            return AuthService.isAuthorized($scope.current.user, 'nodes', 'C');
        };

        $scope.create = function () {
            $scope.route.next('/content/nodes/new');
        };

        $scope.treeFn = {

            canCreate: function (node) {
                if (node.domain === 'core' && node.entity === 'router')
                    return false;

                if (node.domain === 'core') {
                    if (node.entity === 'pointer') {
                        return $jsnbt.entities[node.pointer.entity].parentable && AuthService.isAuthorized($scope.current.user, 'nodes:' + node.pointer.entity, 'C');
                    }
                    else {
                        return $jsnbt.entities[node.entity].parentable && AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'C');
                    }
                }
                else {
                    if ($jsnbt.entities[node.entity].parentable && AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'C')) {
                        return true;
                    }
                }

                return false;
            },

            create: function (node) {
                var targetEntity = $jsnbt.entities[node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity];
                if (node.domain === 'core' && node.entity === 'pointer') {
                    $scope.route.next($jsnbt.entities[node.pointer.entity].getCreateUrl({
                        id: node.pointer.nodeId
                    }, $scope.prefix));
                }
                else {
                    $scope.route.next(targetEntity.getCreateUrl(node, $scope.prefix));
                }
            },

            canEdit: function (node) {
                return $jsnbt.entities[node.entity].editable && AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'U');
            },

            edit: function (node) {
                var editUrl = $jsnbt.entities[node.entity].getEditUrl(node, $scope.prefix);
                $scope.route.next(editUrl);
            },

            canDelete: function (node) {
                if (node.domain === 'core') {
                    if (node.entity !== 'pointer') {
                        return $jsnbt.entities[node.entity].deletable && node.childCount === 0 && AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'D');
                    } else {
                        return AuthService.isAuthorized($scope.current.user, 'nodes:' + node.entity, 'D');
                    }
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

                        ModalService.prompt(function (x) {
                            x.title('oops');
                            x.message('this node is not empty and cannot be deleted');
                        }).then(function (result) {
                       
                        }).catch(function (ex) {
                            throw ex;
                        });
                    }
                    else {

                        ModalService.confirm(function (x) {
                            x.title('are you sure you want to permanently delete the node ' + node.title[$scope.defaults.language] + '?');
                        }).then(function (result) {
                            if (result) {
                                $data.nodes.del(node.id).then(function (nodeDeleteResults) {
                                    self.remove(node);
                                }, function (nodeDeleteError) {
                                    throw nodeDeleteError;
                                });
                            }
                        }).catch(function (ex) {
                            throw ex;
                        });
                    }

                }).catch(function (ex) {
                    throw ex;
                });
            },

            canOpen: function (node) {
                var targetEntity = node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity;
                if (targetEntity) {
                    return $jsnbt.entities[targetEntity].viewable && AuthService.isAuthorized($scope.current.user, 'nodes:' + targetEntity, 'R');
                }
                else {
                    return false;
                }
            },

            open: function (node) {
                var targetEntity = $jsnbt.entities[node.domain === 'core' && node.entity === 'pointer' ? node.pointer.entity : node.entity];
                if (node.domain === 'core' && node.entity === 'pointer') {
                    $data.nodes.get(node.pointer.nodeId).then(function (response) {
                        $scope.route.next(targetEntity.getViewUrl(response, $scope.prefix));
                    }, function (ex) {
                        throw ex;
                    });
                }
                else {
                    $scope.route.next(targetEntity.getViewUrl(node, $scope.prefix));
                }
            }

        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    NodesController.prototype = Object.create(jsnbt.controllers.TreeControllerBase.prototype);

    angular.module("jsnbt")
        .controller('NodesController', ['$scope', '$rootScope', '$jsnbt', '$logger', '$data', 'ModalService', 'AuthService', NodesController]);
})();