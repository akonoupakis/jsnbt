﻿;(function () {
    "use strict";

    var FileSystemEditorController = function ($scope, $rootScope, $logger, $q, TreeNodeService, CONTROL_EVENTS, MODAL_EVENTS) {
        jsnbt.controllers.FormModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('FileSystemEditorController');

        if (!$scope.group)
            throw new Error('$scope.group not defined in FileSystemEditorController');

        if (!$scope.data)
            throw new Error('$scope.data not defined in FileSystemEditorController');
        
        this.enqueue('loaded', function () {
            var deferred = $q.defer();

            $scope.name = $scope.data.type === 'folder' ? $scope.data.name : $scope.data.name.substring(0, $scope.data.name.length - $scope.data.ext.length);
            $scope.ngModel = $scope.name;

            deferred.resolve();

            return deferred.promise;
        });

        this.enqueue('set', function (data) {
            var deferred = $q.defer();

            TreeNodeService.setSelected(data, [self.scope.data.dir]);

            deferred.resolve();

            return deferred.promise;
        });

        $scope.$on(CONTROL_EVENTS.valueChanged, function (sender, value) {
            sender.stopPropagation();
            $scope.ngModel = value;
        });
        
        $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
            $scope.valid = true;
            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
            if ($scope.valid) {
                var selectedFolder = _.first(TreeNodeService.getSelected($scope.nodes));
                var targetPath = (selectedFolder ? selectedFolder : '/' + $scope.group);
                var selectedPath = targetPath + '/' + $scope.ngModel + $scope.data.ext;
                $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel !== '' ? selectedPath : '');
            }
        });

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    FileSystemEditorController.prototype = Object.create(jsnbt.controllers.FormModalControllerBase.prototype);

    FileSystemEditorController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        var restricted = [];
        if (this.scope.data.type === 'folder')
            restricted.push(this.scope.data.path);

        this.ctor.TreeNodeService.getFolders({
            path: this.scope.data.dir,
            restricted: restricted
        }).then(function (response) {

            var nodes = response;
            var groupNode = _.find(response[0].children, function (x) { return x.name == self.scope.group; });
            nodes = groupNode.children;
            deferred.resolve(nodes);

        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    FileSystemEditorController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        this.scope.nodes = data;
      
        deferred.resolve(this.scope.nodes);
      
        return deferred.promise;
    };

    FileSystemEditorController.prototype.get = function () {
        return this.scope.nodes;
    };

    angular.module("jsnbt")
        .controller('FileSystemEditorController', ['$scope', '$rootScope', '$logger', '$q', 'TreeNodeService', 'CONTROL_EVENTS', 'MODAL_EVENTS', FileSystemEditorController]);
})();