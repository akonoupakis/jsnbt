﻿;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LanguageSelectorController', function ($scope, CONTROL_EVENTS, MODAL_EVENTS) {
     
            if (!$scope.data)
                throw new Error('$scope.data not defined in LanguageSelectorController');
            
            $scope.valid = false;
            $scope.ngModel = $scope.selected;

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
                if ($scope.valid) {
                    var selected = _.first(_.filter($scope.data, function (x) { return x.code === $scope.ngModel; }));
                    $scope.$emit(MODAL_EVENTS.valueSubmitted, selected);
                }
            });

        });
})();