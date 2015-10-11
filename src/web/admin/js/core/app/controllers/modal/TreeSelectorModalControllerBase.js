/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.TreeSelectorModalControllerBase = (function (TreeSelectorModalControllerBase) {

                TreeSelectorModalControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.TreeControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;
                    
                    if (!$scope.mode)
                        $scope.mode = 'single';

                    if (['single', 'multiple'].indexOf($scope.mode) === -1)
                        $scope.mode = 'single';

                    this.enqueue('set', function (data) {
                        self.setSelected($scope.selected);
                    });

                    $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                        self.requested();
                    });

                    $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                        sender.stopPropagation();
                        self.selected(selected);
                    });

                    $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                        sender.stopPropagation();
                        self.submitted(selected);
                    });

                };
                TreeSelectorModalControllerBase.prototype = Object.create(controllers.TreeControllerBase.prototype);

                TreeSelectorModalControllerBase.prototype.select = function (selected) {
                    return selected.id;
                };

                TreeSelectorModalControllerBase.prototype.setSelected = function (selected) {
                    if (selected)
                        this.ctor.TreeNodeService.setSelected(this.scope.nodes, this.scope.mode === 'multiple' ? selected : [selected]);
                };

                TreeSelectorModalControllerBase.prototype.getSelected = function () {
                    var selected = this.scope.mode === 'single' ? _.first(this.ctor.TreeNodeService.getSelected(this.scope.nodes)) : this.ctor.TreeNodeService.getSelected(this.scope.nodes);
                    return selected;
                };

                TreeSelectorModalControllerBase.prototype.requested = function () {
                    var selected = this.getSelected();
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, selected);
                };

                TreeSelectorModalControllerBase.prototype.selected = function (selected) {
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
                };

                TreeSelectorModalControllerBase.prototype.submitted = function (selected) {

                };

                return TreeSelectorModalControllerBase;

            })(controllers.TreeSelectorModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();