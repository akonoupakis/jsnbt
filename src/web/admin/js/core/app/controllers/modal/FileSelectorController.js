;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileSelectorController', function ($scope, CONTROL_EVENTS, MODAL_EVENTS) {

            if (!$scope.mode)
                $scope.mode = 'single';

            if (['single', 'multiple'].indexOf($scope.mode) === -1)
                $scope.mode = 'single';

            $scope.ngModel = $scope.selected;

            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
            });

            $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                sender.stopPropagation();

                $scope.$emit(MODAL_EVENTS.valueSubmitted, selected);
            });

            $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                sender.stopPropagation();
            });
        });
})();