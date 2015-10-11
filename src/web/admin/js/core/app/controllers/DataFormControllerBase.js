﻿/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.DataFormControllerBase = (function (DataFormControllerBase) {

                DataFormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var logger = $logger.create('DataFormControllerBase');

                    $scope.localization = true;

                    $scope.list = undefined;
                    $scope.item = undefined;

                    this.enqueue('preloading', function () {
                        var deferred = $q.defer();

                        $scope.list = _.find($jsnbt.lists, function (x) { return x.domain === $scope.domain && x.id === ($scope.listId || $routeParams.list); });

                        $scope.setTitle($scope.list.name);

                        $scope.localized = $scope.application.localization.enabled && ($scope.list.localized === undefined || $scope.list.localized === true);

                        $scope.template = $scope.list.form;

                        deferred.resolve();

                        return deferred.promise;
                    });
                    
                };
                DataFormControllerBase.prototype = Object.create(controllers.FormControllerBase.prototype);

                DataFormControllerBase.prototype.load = function () {
                    var deferred = this.ctor.$q.defer();

                    if (this.isNew()) {
                        deferred.resolve();
                    }
                    else {
                        this.ctor.$data.data.get(this.scope.id).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

                DataFormControllerBase.prototype.get = function () {
                    return this.scope.item;
                };

                DataFormControllerBase.prototype.set = function (data) {
                    var deferred = this.ctor.$q.defer();

                    if (this.isNew()) {
                        this.setTitle('');

                        this.scope.item = this.ctor.$data.create('data', {
                            domain: this.scope.domain,
                            list: this.scope.list.id
                        })

                        this.setValid(true);
                        this.setPublished(false);

                        deferred.resolve(this.scope.item);
                    }
                    else {
                        if (data) {
                            this.setTitle(data.title[this.scope.defaults.language]);
                            this.scope.item = data;

                            this.setValid(true);
                            this.setPublished(true);

                            deferred.resolve(this.scope.item);
                        }
                        else {
                            deferred.reject(new Error('data is not defined for setting into scope'));
                        }
                    }

                    return deferred.promise;
                };

                DataFormControllerBase.prototype.getBreadcrumb = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    controllers.FormControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

                        if (self.scope.list)
                            breadcrumb[breadcrumb.length - 2].name = self.scope.list.name;

                        deferred.resolve(breadcrumb);

                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

                DataFormControllerBase.prototype.push = function (data) {
                    var deferred = this.ctor.$q.defer();

                    if (this.isNew()) {
                        this.ctor.$data.data.post(this.scope.item).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        this.ctor.$data.data.put(this.scope.id, this.scope.item).then(function (result) {
                            deferred.resolve(result);
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };

                return DataFormControllerBase;

            })(controllers.DataFormControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();