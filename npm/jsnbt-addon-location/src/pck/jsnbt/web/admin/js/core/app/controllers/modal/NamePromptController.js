;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NamePromptController', function ($scope, CONTROL_EVENTS, MODAL_EVENTS) {
     
            $scope.valid = false;
            $scope.ngModel = $scope.selected;
            $scope.ngCharacters = ($scope.validChars || []).join('');

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender, value) {
                sender.stopPropagation();

                $scope.ngModel = value;
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