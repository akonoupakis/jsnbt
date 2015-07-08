﻿;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileSystemEditorController', ['$scope', 'TreeNodeService', 'CONTROL_EVENTS', 'MODAL_EVENTS', function ($scope, TreeNodeService, CONTROL_EVENTS, MODAL_EVENTS) {
     
            if (!$scope.group)
                throw new Error('$scope.group not defined in FileSystemEditorController');

            if (!$scope.data)
                throw new Error('$scope.data not defined in FileSystemEditorController');

            $scope.valid = false;
            $scope.name = $scope.data.type === 'folder' ? $scope.data.name : $scope.data.name.substring(0, $scope.data.name.length - $scope.data.ext.length);
            $scope.nodes = [];
            
            $scope.ngModel = $scope.name;

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender, value) {
                sender.stopPropagation();

                $scope.ngModel = value;
            });

            $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });

            var restricted = [];
            if ($scope.data.type === 'folder')
                restricted.push($scope.data.path);

            console.log($scope.data.dir);

            TreeNodeService.getFolders({
                path: $scope.data.dir,
                restricted: restricted
            }).then(function (response) {
                $scope.nodes = response;
                
                var groupNode = _.find(response[0].children, function (x) { return x.name == $scope.group; });

                $scope.nodes = groupNode.children;

                TreeNodeService.setSelected($scope.nodes, [$scope.data.dir]);
            }, function (error) {
                throw error;
            });

            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                $scope.valid = true;
                $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
                if ($scope.valid) {
                    var selectedFolder = _.first(TreeNodeService.getSelected($scope.nodes));
                    var selectedPath = selectedFolder + (selectedFolder !== '/' ? '/' : '') + $scope.ngModel + $scope.data.ext;
                    
                    $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel !== '' ? selectedPath : '');
                }
            });

        }]);
})();