;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('NamePromptController', function ($scope) {
     
            $scope.selected = '';

            $scope.$on('select', function (sender) {
                $scope.$emit('selected', $scope.selected);
            });

        });
})();