;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LocationNamePromptController', function ($scope, CONTROL_EVENTS, MODAL_EVENTS) {
     
            $scope.valid = false;

            $scope.ngTypes = [{
                value: 'location-category',
                name: 'category'
            }, {
                value: 'location',
                name: 'location'
            }];

            $scope.ngModel = {
                entity: 'location',
                name: ''
            };

            $scope.ngCharacters = ($scope.validChars || []).join('');

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
                if ($scope.valid) {
                    $scope.$emit(MODAL_EVENTS.valueSubmitted, $scope.ngModel);
                }
            });

        });
})();