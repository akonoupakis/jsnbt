/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.TreeSelectorModalControllerBase = (function (TreeSelectorModalControllerBase) {

                TreeSelectorModalControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.TreeControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    if (!$scope.domain)
                        throw new Error('$scope.domain not defined in TreeNodeSelectorController');

                    if (!$scope.mode)
                        $scope.mode = 'single';

                    if (['single', 'multiple'].indexOf($scope.mode) === -1)
                        $scope.mode = 'single';

                    this.enqueue('set', function (data) {
                        if ($scope.selected)
                            TreeNodeService.setSelected(data, $scope.mode === 'multiple' ? $scope.selected : [$scope.selected]);
                    });

                    $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                        var selected = $scope.mode === 'single' ? _.first(TreeNodeService.getSelected($scope.nodes)) : TreeNodeService.getSelected($scope.nodes);
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

                };
                TreeSelectorModalControllerBase.prototype = Object.create(controllers.TreeControllerBase.prototype);

                return TreeSelectorModalControllerBase;

            })(controllers.TreeSelectorModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();