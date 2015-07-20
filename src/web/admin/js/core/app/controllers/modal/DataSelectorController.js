;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('DataSelectorController', ['$scope', '$data', 'PagedDataService', 'CONTROL_EVENTS', 'MODAL_EVENTS', function ($scope, $data, PagedDataService, CONTROL_EVENTS, MODAL_EVENTS) {
     
            $scope.data = [];

            if (!$scope.domain)
                throw new Error('$scope.domain not defined in DataSelectorController');
            
            if (!$scope.mode)
                $scope.mode = 'single';

            if (['single', 'multiple'].indexOf($scope.mode) === -1)
                $scope.mode = 'single';
            
            PagedDataService.get(jsnbt.db.data.get, {
                domain: $scope.domain,
                list: $scope.list
            }, undefined, undefined, ($scope.mode === 'single' ? [$scope.selected] : $scope.selected)).then(function (response) {
                $scope.data = response;
            }, function (error) {
                throw error;
            });

            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                var allSelected = _.pluck(_.filter($scope.data.items, function (x) { return x.selected; }), 'id');
                var selected = $scope.mode === 'single' ? _.first(allSelected) : allSelected;
                $scope.$emit(MODAL_EVENTS.valueSubmitted, selected);
            });

            $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                sender.stopPropagation();

                var selectedId = selected.id;
                $scope.$emit(MODAL_EVENTS.valueSubmitted, selectedId);
            });
            
            $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                sender.stopPropagation();
            });

        }]);
})();