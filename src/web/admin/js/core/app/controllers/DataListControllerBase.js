/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.DataListControllerBase = (function (DataListControllerBase) {

                DataListControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService, NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    $scope.selector = 'data';

                    controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    var logger = $logger.create('DataListControllerBase');

                    $scope.localization = true;

                    $scope.id = $scope.route.current.params.list;
                    $scope.list = undefined;
                    
                    $scope.loadingOptions = {};

                    this.enqueue('preloading', '', function () {
                        var deferred = $q.defer();

                        $scope.list = _.find($jsnbt.lists, function (x) { return x.domain === $scope.domain && x.id === ($scope.listId || $scope.id); });
                        self.setTitle($scope.list.name);

                        if ($scope.list.list) {
                            $scope.template = $scope.list.list;
                        }

                        $.extend(true, $scope.loadingOptions, {
                            domain: $scope.domain,
                            list: $scope.list.id,
                            $sort: {}
                        });

                        $scope.loadingOptions['$sort']['title.' + $scope.defaults.language] = 1;

                        deferred.resolve();

                        return deferred.promise;
                    });
                
                    $scope.canCreate = function () {
                        return AuthService.isAuthorized($scope.current.user, 'data:' + $scope.domain + ':' + $scope.id, 'C');
                    };

                    $scope.create = function () {
                        $scope.route.next(_.last($scope.current.breadcrumb.items).url + '/new');
                    };

                    $scope.gridFn = $scope.gridFn || {};

                    $scope.gridFn.load = function (filters, sorter) {
                        self.load(filters, sorter).then(function (response) {
                            $scope.model = response;

                            if ($scope.modal && $scope.modal.selector === 'data')
                                self.setSelected($scope.modal.selected);
                        }).catch(function (error) {
                            throw error;
                        });
                    };

                    $scope.gridFn.canEdit = function (row) {
                        return AuthService.isAuthorized($scope.current.user, 'data:' + row.domain + ':' + row.list, 'U');
                    };

                    $scope.gridFn.edit = function (row) {
                        $scope.route.next(_.last($scope.current.breadcrumb.items).url + '/' + row.id);
                    };

                    $scope.gridFn.canDelete = function (row) {
                        return AuthService.isAuthorized($scope.current.user, 'data:' + row.domain + ':' + row.list, 'D');
                    };

                    $scope.gridFn.delete = function (row) {
                        ModalService.confirm(function (x) {
                            x.title('are you sure you want to permanently delete ' + row.title[$scope.defaults.language] + '?');
                        }).then(function (result) {
                            if (result) {
                                $data.data.del(row.id).then(function () {
                                    self.remove(row);
                                }).catch(function (error) {
                                    throw error;
                                });
                            }
                        });
                    };

                };
                DataListControllerBase.prototype = Object.create(controllers.ListControllerBase.prototype);

                DataListControllerBase.prototype.load = function (filters, sorter) {
                    var deferred = this.ctor.$q.defer();
                    
                    this.ctor.$data.data.getPage({
                        query: this.scope.loadingOptions,
                        filters: filters,
                        sorter: sorter
                    }).then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                DataListControllerBase.prototype.select = function (selected) {
                    return selected.id;
                };

                DataListControllerBase.prototype.setSelected = function (selected) {
                    controllers.ListControllerBase.prototype.setSelected.apply(this, [this.scope.modal && this.scope.modal.mode === 'multiple' ? selected : [selected]]);
                };

                DataListControllerBase.prototype.getSelected = function () {
                    var selected = this.scope.modal && this.scope.modal.mode === 'single' ? _.first(controllers.ListControllerBase.prototype.getSelected.apply(this, arguments)) : controllers.ListControllerBase.prototype.getSelected.apply(this, arguments);
                    return selected;
                };

                DataListControllerBase.prototype.requested = function () {
                    var selected = this.getSelected();
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, selected);
                };

                DataListControllerBase.prototype.selected = function (selected) {
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
                };

                DataListControllerBase.prototype.submitted = function () {
                    var selected = this.getSelected();
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, selected);
                };

                DataListControllerBase.prototype.getBreadcrumb = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    controllers.ListControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

                        if (self.scope.list)
                            _.last(breadcrumb).name = self.scope.list.name;

                        deferred.resolve(breadcrumb);

                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

                return DataListControllerBase;

            })(controllers.DataListControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();