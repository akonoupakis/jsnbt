;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileSystemEditorController', function ($scope, TreeNodeService) {
     
            if (!$scope.data)
                throw new Error('$scope.data not defined in FileSystemEditorController');

            $scope.name = $scope.data.type === 'folder' ? $scope.data.name : $scope.data.name.substring(0, $scope.data.name.length - $scope.data.ext.length);
            $scope.nodes = [];

            var restricted = [];
            if ($scope.data.type === 'folder')
                restricted.push($scope.data.path);

            TreeNodeService.getFolders({
                path: $scope.data.dir,
                restricted: restricted
            }).then(function (response) {
                $scope.nodes = response;
                TreeNodeService.setSelected($scope.nodes, [$scope.data.dir]);
            }, function (error) {
                throw error;
            });

            $scope.$on('select', function (sender) {
                var selectedFolder = _.first(TreeNodeService.getSelected($scope.nodes));
                var selectedPath = selectedFolder + (selectedFolder !== '/' ? '/' : '') + $scope.name + $scope.data.ext;

                $scope.$emit('selected', $scope.name !== '' ? selectedPath : '');
            });

        });
})();