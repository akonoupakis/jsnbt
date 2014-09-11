;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LanguageSelectorController', function ($scope) {
     
            if (!$scope.data)
                throw new Error('$scope.data not defined in LanguageSelectorController');

            $scope.$on('select', function (sender) {
                var selected = _.first(_.filter($scope.data, function (x) { return x.code === $scope.selected; }));
                $scope.$emit('selected', selected);
            });

        });
})();