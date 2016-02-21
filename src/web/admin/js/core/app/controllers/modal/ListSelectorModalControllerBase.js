/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ListSelectorModalControllerBase = (function (ListSelectorModalControllerBase) {

                ListSelectorModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    var domain = $scope.domain;

                    controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));
                    
                    var self = this;

                    $scope.breadcrumb = false;
                    $scope.domain = domain;

                    this.enqueue('set', '', function (data) {
                        self.setSelected($scope.modal.selected);
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
                ListSelectorModalControllerBase.prototype = Object.create(controllers.ListControllerBase.prototype);

                ListSelectorModalControllerBase.prototype.select = function (selected) {
                    return selected.id;
                };

                ListSelectorModalControllerBase.prototype.setSelected = function (selected) {
                    if (selected)
                        this.ctor.PagedDataService.setSelected(this.get(), this.scope.modal.mode === 'multiple' ? selected : [selected], 'id');
                };

                ListSelectorModalControllerBase.prototype.getSelected = function () {
                    var selected = this.scope.modal.mode === 'single' ? _.first(this.ctor.PagedDataService.getSelected(this.get(), 'id')) : this.ctor.PagedDataService.getSelected(this.get(), 'id');
                    return selected;
                };

                ListSelectorModalControllerBase.prototype.requested = function () {
                    var selected = this.getSelected();
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, selected);
                };

                ListSelectorModalControllerBase.prototype.selected = function (selected) {                
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
                };

                ListSelectorModalControllerBase.prototype.submitted = function (selected) {
                   
                };
                
                return ListSelectorModalControllerBase;

            })(controllers.ListSelectorModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();