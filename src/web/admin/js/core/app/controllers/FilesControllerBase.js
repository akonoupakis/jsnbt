/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.FilesControllerBase = (function (FilesControllerBase) {

                FilesControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    var logger = $logger.create('FilesControllerBase');

                    $scope.path = '/';
                    $scope.fileGroup = $scope.modal && $scope.modal.group || 'public';

                    if ($scope.modal) {
                        $scope.breadcrumb = false;

                        if ($scope.modal.mode === 'single') {
                            if ($scope.modal.selected && typeof ($scope.modal.selected) === 'string') {
                                var parts = $scope.modal.selected.split('/');
                                if (parts.length > 2)
                                    $scope.path += _.initial(_.rest(parts, 1), 1).join('/');
                            }
                        }

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
                    }
                };
                FilesControllerBase.prototype = Object.create(controllers.ListControllerBase.prototype);

                FilesControllerBase.prototype.load = function (filters, sorter) {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve();

                    return deferred.promise;
                };

                FilesControllerBase.prototype.select = function (selected) {
                    return selected;
                };

                FilesControllerBase.prototype.getSelected = function () {
                    return this.scope.modal.selected;
                };

                FilesControllerBase.prototype.setSelected = function (selected) {
                    
                };
                
                FilesControllerBase.prototype.requested = function () {
                    if (this.scope.modal) {
                        this.scope.$broadcast(this.ctor.CONTROL_EVENTS.valueRequested);
                        this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.scope.modal.selected);
                    }
                };

                FilesControllerBase.prototype.selected = function (selected) {
                    if (this.scope.modal)
                        this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
                };

                FilesControllerBase.prototype.submitted = function (selected) {
                    this.scope.modal.selected = selected;
                };
                
                return FilesControllerBase;

            })(controllers.FilesControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();