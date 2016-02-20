/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.TreeSelectorModalControllerBase = (function (TreeSelectorModalControllerBase) {

                TreeSelectorModalControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    var domain = $scope.domain;

                    controllers.TreeControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;
                    
                    $scope.breadcrumb = false;
                    $scope.domain = domain;

                    if (!$scope.mode)
                        $scope.mode = 'single';

                    if (['single', 'multiple'].indexOf($scope.mode) === -1)
                        $scope.mode = 'single';

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
                TreeSelectorModalControllerBase.prototype = Object.create(controllers.TreeControllerBase.prototype);

                TreeSelectorModalControllerBase.prototype.select = function (selected) {
                    return selected.id;
                };

                TreeSelectorModalControllerBase.prototype.setSelected = function (selected) {
                    if (selected)
                        this.ctor.TreeNodeService.setSelected(this.scope.model, this.scope.modal.mode === 'multiple' ? selected : [selected]);
                };

                TreeSelectorModalControllerBase.prototype.getSelected = function () {
                    var selected = this.scope.modal.mode === 'single' ? _.first(this.ctor.TreeNodeService.getSelected(this.scope.model)) : this.ctor.TreeNodeService.getSelected(this.scope.model);
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

                TreeSelectorModalControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    this.ctor.$rootScope.controller = this;

                    controllers.TreeControllerBase.prototype.init.apply(this, arguments).then(function () {
                        deferred.resolve();
                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

                return TreeSelectorModalControllerBase;

            })(controllers.TreeSelectorModalControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();