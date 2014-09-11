;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DeletePromptController', function ($scope) {
     
            $scope.selected = false;

            $scope.$on('select', function (sender) {
                $scope.$emit('selected', $scope.selected);
            });

        });
})();