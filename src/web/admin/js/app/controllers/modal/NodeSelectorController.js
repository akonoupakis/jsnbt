;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NodeSelectorController', function ($scope, $data, TreeNodeService) {
     
            $scope.nodes = [];

            if (!$scope.domain)
                throw new Error('$scope.domain not defined in NodeSelectorController');
            
            if (!$scope.mode)
                $scope.mode = 'single';

            if (['single', 'multiple'].indexOf($scope.mode) === -1)
                $scope.mode = 'single';

            if (($scope.mode === 'single' && $scope.selected) || ($scope.mode === 'multiple' && $scope.selected && $scope.selected.length > 0)) {
                var selectedQry = $scope.mode === 'multiple' ? { id: { $in: $scope.selected } } : { id: { $in: [$scope.selected] } };

                $data.nodes.get(selectedQry).then(function (nodes) {
                    var parentIds = [];
                    $(nodes).each(function (n, node) {
                        var nodeParentIds = node.hierarchy.reverse().slice(1).reverse();
                        $(nodeParentIds).each(function (np, nodeParent) {
                            if(parentIds.indexOf(nodeParent) === -1)
                                parentIds.push(nodeParent);
                        });
                    });
                    
                    var opts = {};
                    $.extend(true, opts, $scope.options, {
                        domain: $scope.domain,
                        parentId: '',
                        parentIds: parentIds
                    });

                    TreeNodeService.getNodes(opts).then(function (response) {
                        $scope.nodes = response[0].children;

                        if ($scope.selected)
                            TreeNodeService.setSelected($scope.nodes, $scope.mode === 'multiple' ? $scope.selected : [$scope.selected]);
                    }, function (error) {
                        throw error;
                    });

                }, function (ex) {
                    throw ex;
                });
            }
            else {
                var opts2 = {};
                $.extend(true, opts2, $scope.options, {
                    domain: $scope.domain,
                    parentId: '',
                    parentIds: []
                });

                TreeNodeService.getNodes(opts2).then(function (response) {
                    $scope.nodes = response[0].children;
                }, function (error) {
                    throw error;
                });
            }

            $scope.$on('select', function (sender) {
                var selected = $scope.mode === 'single' ? _.first(TreeNodeService.getSelected($scope.nodes)) : TreeNodeService.getSelected($scope.nodes);
                $scope.$emit('selected', selected);
            });

        });
})();