/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.DataListControllerBase = (function (DataListControllerBase) {

                DataListControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controllers.ListControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    var logger = $logger.create('DataListControllerBase');

                    $scope.localization = true;

                    $scope.id = $routeParams.list;
                    $scope.list = undefined;

                    $scope.loadingOptions = {};

                    this.enqueue('preloading', function () {
                        var deferred = $q.defer();

                        $scope.list = _.find($jsnbt.lists, function (x) { return x.domain === $scope.domain && x.id === ($scope.listId || $scope.id); });
                        self.setTitle($scope.list.name);

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
                        return true;
                    };

                    $scope.create = function () {
                        $location.next(_.last($scope.current.breadcrumb.items).url + '/new');
                    };

                    $scope.gridFn = $scope.gridFn || {};

                    $scope.gridFn.canEdit = function (row) {
                        return true;
                    };

                    $scope.gridFn.edit = function (row) {
                        $location.next(_.last($scope.current.breadcrumb.items).url + '/' + row.id);
                    };

                    $scope.gridFn.canDelete = function (row) {
                        return true;
                    };

                    $scope.gridFn.delete = function (row) {
                        ModalService.open({
                            title: 'are you sure you want to permanently delete ' + row.title[$scope.defaults.language] + '?',
                            controller: 'DeletePromptController',
                            template: 'tmpl/core/modals/deletePrompt.html'
                        }).then(function (result) {
                            if (result) {
                                $data.data.del(row.id).then(function () {
                                    self.remove(row);
                                }).catch(function (error) {
                                    deferred.reject(error);
                                });
                            }
                        });
                    };

                };
                DataListControllerBase.prototype = Object.create(controllers.ListControllerBase.prototype);

                DataListControllerBase.prototype.load = function () {
                    var deferred = this.ctor.$q.defer();

                    this.ctor.PagedDataService.get(this.ctor.$jsnbt.db.data.get, this.scope.loadingOptions).then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
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