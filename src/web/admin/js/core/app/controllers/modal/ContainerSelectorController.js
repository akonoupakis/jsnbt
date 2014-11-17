;(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('ContainerSelectorController', function ($scope, $jsnbt, CONTROL_EVENTS, MODAL_EVENTS) {
     
            $scope.data = [];

            if (!$scope.mode)
                $scope.mode = 'single';

            if (['single', 'multiple'].indexOf($scope.mode) === -1)
                $scope.mode = 'single';
            
            $scope.data = {
                items: []
            };

            $($jsnbt.containers).each(function (c, container) {

                var allSelected = $scope.mode === 'multiple' ? (_.isArray($scope.selected) ? $scope.selected : []) : (_.isString($scope.selected) ? [$scope.selected] : []);

                var containerItem = {
                    name: container,
                    selected: allSelected.indexOf(container) !== -1
                };

                $scope.data.items.push(containerItem);
            });
            
            $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                var allSelected = _.pluck(_.filter($scope.data.items, function (x) { return x.selected; }), 'id');
                var selected = $scope.mode === 'single' ? _.first(allSelected) : allSelected;
                $scope.$emit(MODAL_EVENTS.valueSubmitted, selected);
            });

            $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                sender.stopPropagation();

                $scope.$emit(MODAL_EVENTS.valueSubmitted, selected);
            });
            
            $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                sender.stopPropagation();
            });

        });
})();