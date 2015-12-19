;(function () {
    "use strict";

    var TreeNodeSelectorController = function ($scope, $rootScope, $data, $logger, TreeNodeService, CONTROL_EVENTS, MODAL_EVENTS) {
        jsnbt.controllers.TreeSelectorModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('TreeNodeSelectorController');
        
        if (!$scope.domain)
            throw new Error('$scope.domain not defined in TreeNodeSelectorController');
        
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    TreeNodeSelectorController.prototype = Object.create(jsnbt.controllers.TreeSelectorModalControllerBase.prototype);
    
    TreeNodeSelectorController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        if ((self.scope.mode === 'single' && self.scope.selected) || (self.scope.mode === 'multiple' && self.scope.selected && self.scope.selected.length > 0)) {
            var selectedQry = self.scope.mode === 'multiple' ? { id: { $in: self.scope.selected } } : { id: { $in: [self.scope.selected] } };

            self.ctor.$data.nodes.get(selectedQry).then(function (nodes) {
                var parentIds = [];
                $(nodes).each(function (n, node) {
                    var nodeParentIds = node.hierarchy.reverse().slice(1).reverse();
                    $(nodeParentIds).each(function (np, nodeParent) {
                        if (parentIds.indexOf(nodeParent) === -1)
                            parentIds.push(nodeParent);
                    });
                });

                var opts = {};
                $.extend(true, opts, {
                    domain: self.scope.domain,
                    parentId: '',
                    parentIds: parentIds
                }, self.scope.options);

                self.ctor.TreeNodeService.getNodes(opts).then(function (response) {
                    if (response.length === 0) {
                        deferred.resolve([]);
                    }
                    else {
                        deferred.resolve(response[0].children);
                    }
                }).catch(function (error) {
                    deferred.reject(error);
                });

            }).catch(function (ex) {
                deferred.reject(ex);
            });
        }
        else {
            var opts2 = {};
            $.extend(true, opts2, {
                domain: self.scope.domain,
                parentId: '',
                parentIds: []
            }, self.scope.options);

            self.ctor.TreeNodeService.getNodes(opts2).then(function (response) {
                if (response.length === 0) {
                    deferred.resolve([]);
                }
                else {
                    deferred.resolve(response[0].children);
                }
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('NodeSelectorController', ['$scope', '$rootScope', '$data', '$logger', 'TreeNodeService', 'CONTROL_EVENTS', 'MODAL_EVENTS', TreeNodeSelectorController]);
})();