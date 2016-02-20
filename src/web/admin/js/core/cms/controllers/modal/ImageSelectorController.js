;(function () {
    "use strict";

    var ImageSelectorController = function ($scope, $rootScope, $logger, MODAL_EVENTS, CONTROL_EVENTS) {
        jsnbt.controllers.ListSelectorModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('ImageSelectorController');
        
        $scope.modal.step = $scope.modal.step || 1;

        $scope.ngModel = {};
        if ($scope.modal.selected && typeof ($scope.modal.selected) === 'object' && $scope.modal.selected.src && $scope.modal.selected.gen)
            $.extend(true, $scope.ngModel, $scope.modal.selected);

        $scope.fileGroup = $scope.modal.group ? $scope.modal.group : 'public';

        $scope.path = '/';

        if ($scope.ngModel.src) {
            var parts = $scope.ngModel.src.split('/');
            if (parts.length > 2)
                $scope.path += _.initial(_.rest(parts, 1), 1).join('/');
        }

        $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
            $scope.$broadcast(CONTROL_EVENTS.valueRequested);
            if ($scope.modal.step === 1 && $scope.modal.height && $scope.modal.width) {
                $scope.ngModel.gen = [];
                $scope.modal.step++;
            }
            else {
                $scope.modal.selected = $scope.ngModel;
                $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
            }
        });

        $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
            sender.stopPropagation();

            $scope.ngModel.gen = [];
            $scope.ngModel.src = selected;

            if ($scope.modal.step === 1 && $scope.modal.height && $scope.modal.width) {
                $scope.modal.step++;
            }
            else {
                $scope.modal.selected = $scope.ngModel;
                $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
            }
        });

        $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
            sender.stopPropagation();

            if (sender.targetScope.ctrl === 'ctrlExplorer')
                $scope.ngModel.src = selected;
            if (sender.targetScope.ctrl === 'ctrlImageCropper')
                $scope.ngModel.gen = selected;
        });

    };
    ImageSelectorController.prototype = Object.create(jsnbt.controllers.ListSelectorModalControllerBase.prototype);

    ImageSelectorController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        deferred.resolve({});

        return deferred.promise;
    };

    ImageSelectorController.prototype.requested = function () {
   
    };

    ImageSelectorController.prototype.selected = function (selected) {

    };

    ImageSelectorController.prototype.submitted = function (selected) {
       
    };

    angular.module("jsnbt")
        .controller('ImageSelectorController', ['$scope', '$rootScope', '$logger', 'MODAL_EVENTS', 'CONTROL_EVENTS', ImageSelectorController]);
})();