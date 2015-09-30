;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ImageSelectorController', ['$scope', 'MODAL_EVENTS', 'CONTROL_EVENTS', function ($scope, MODAL_EVENTS, CONTROL_EVENTS) {

            $scope.mode = 'single';

            $scope.step = $scope.step || 1;

            $scope.ngModel = {};
            if ($scope.selected && typeof ($scope.selected) === 'object' && $scope.selected.src && $scope.selected.gen)
                $.extend(true, $scope.ngModel, $scope.selected);

            $scope.fileGroup = $scope.group ? $scope.group : 'public';

            $scope.path = '/';
            
            if ($scope.ngModel.src) {
                var parts = $scope.ngModel.src.split('/');
                if (parts.length > 2)
                    $scope.path += _.initial(_.rest(parts, 1), 1).join('/');
            }

            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {             
                $scope.$broadcast(CONTROL_EVENTS.valueRequested);
                if ($scope.step === 1 && $scope.height && $scope.width) {
                    $scope.ngModel.gen = [];
                    $scope.step++;
                }
                else {
                    $scope.selected = $scope.ngModel;
                    $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
                }
            });

            $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                sender.stopPropagation();

                $scope.ngModel.gen = [];
                $scope.ngModel.src = selected;

                if ($scope.step === 1 && $scope.height && $scope.width) {
                    $scope.step++;
                }
                else {
                    $scope.selected = $scope.ngModel;
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

        }]);
})();