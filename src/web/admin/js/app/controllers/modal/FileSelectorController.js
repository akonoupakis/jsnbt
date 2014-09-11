;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('FileSelectorController', function ($scope) {

            if (!$scope.mode)
                $scope.mode = 'single';

            if (['single', 'multiple'].indexOf($scope.mode) === -1)
                $scope.mode = 'single';

            // triggered as such from the parent modal
            // $scope.selected = '';
            // $scope.$on('selected', function (sender, value) {
            //     $scope.selected = value;
            // });

            // $scope.$on('select', function (sender) {
            //      $scope.$emit('selected', $scope.selected);
            // });

        });
})();