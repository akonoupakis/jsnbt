;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DataSelectorController', function ($scope, $data, PagedDataService) {
     
            $scope.data = [];

            if (!$scope.domain)
                throw new Error('$scope.domain not defined in NodeSelectorController');
            
            if (!$scope.mode)
                $scope.mode = 'single';

            if (['single', 'multiple'].indexOf($scope.mode) === -1)
                $scope.mode = 'single';
            
            PagedDataService.get(dpd.data.get, {
                domain: $scope.domain,
                list: $scope.list
            }, undefined, undefined, ($scope.mode === 'single' ? [$scope.selected] : $scope.selected)).then(function (response) {
                $scope.data = response;
            }, function (error) {
                throw error;
            });

            $scope.$on('select', function (sender) {
                var allSelected = _.pluck(_.filter($scope.data.items, function (x) { return x.selected; }), 'id');
                var selected = $scope.mode === 'single' ? _.first(allSelected) : allSelected;
                $scope.$emit('selected', selected);
            });

        });
})();