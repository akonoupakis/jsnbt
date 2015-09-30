﻿;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DeletePromptController', ['$scope', 'MODAL_EVENTS', function ($scope, MODAL_EVENTS) {
     
            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {     
                $scope.$emit(MODAL_EVENTS.valueSubmitted, true);
            });

        }]);
})();