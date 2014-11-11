;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TextPromptController', function ($scope, CONTROL_EVENTS, MODAL_EVENTS) {
     
            $scope.valid = false;

            $scope.ngModel = {
                group: undefined,
                key: undefined
            };

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender, value) {
                sender.stopPropagation();
            });

            $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });

            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                $scope.valid = true;
                $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
                if ($scope.valid)
                    $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
            });

        });
})();