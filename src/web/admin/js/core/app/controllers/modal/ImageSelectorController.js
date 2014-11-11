;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ImageSelectorController', function ($scope, MODAL_EVENTS, CONTROL_EVENTS) {

            $scope.mode = 'single';

            $scope.step = $scope.step || 1;
            $scope.lastStep = 2;

            $scope.ngModel = $scope.selected || {};
            
            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {             
                $scope.$broadcast(CONTROL_EVENTS.valueRequested);
                if ($scope.step === 1) {
                    $scope.step++;
                }
                else {
                    $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
                }
            });

            $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                sender.stopPropagation();

                if ($scope.step === 1) {
                    $scope.ngModel.src = selected;
                    $scope.ngModel.gen = {};
                }
                $scope.step++;
            });

            $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                sender.stopPropagation();
            });

        });
})();