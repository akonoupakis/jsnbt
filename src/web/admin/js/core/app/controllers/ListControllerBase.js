/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ListControllerBase = (function (ListControllerBase) {

                ListControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.localization = true;

                    $scope.title = undefined;
                    $scope.model = {};

                    $scope.found = undefined;

                    if ($scope.modal && $scope.modal.selector === $scope.selector) {
                        this.enqueue('set', '', function (data) {
                            if ($scope.modal.selected) {
                                self.setSelected($scope.modal.selected);
                            }
                        });
                    };

                    this.enqueue('watch', '', function () {
                        var deferred = $q.defer();

                        $scope.$watch('title', function (newValue, prevValue) {
                            if (newValue !== prevValue && newValue !== undefined) {
                                self.getBreadcrumb().then(function (breadcrumb) {
                                    self.setBreadcrumb(breadcrumb).catch(function (setBreadcrumbError) {
                                        throw setBreadcrumbError;
                                    });
                                }).catch(function (getBreadcrumbError) {
                                    throw getBreadcrumbError;
                                });
                            }
                        });

                        deferred.resolve();

                        return deferred.promise;
                    });
                    
                };
                ListControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                ListControllerBase.prototype.preload = function () {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve();

                    return deferred.promise;
                };

                ListControllerBase.prototype.load = function () {
                    throw new Error('not implemented');
                };

                ListControllerBase.prototype.set = function (data) {
                    var deferred = this.ctor.$q.defer();

                    this.scope.model = data;

                    deferred.resolve(this.scope.model);

                    if (this.scope.modal && this.scope.modal.selected) {
                        this.setSelected(this.scope.modal.selected);
                    }

                    return deferred.promise;
                };

                ListControllerBase.prototype.get = function () {
                    
                    return this.scope.model;

                };

                ListControllerBase.prototype.setTitle = function (title) {
                    this.scope.title = title;
                };

                ListControllerBase.prototype.remove = function (item) {
                    this.scope.model.items = _.filter(this.scope.model.items, function (x) { return x.id !== item.id; });
                };

                ListControllerBase.prototype.select = function (selected) {
                    return selected.id;
                };

                ListControllerBase.prototype.getSelected = function () {
                    var results = _.pluck(_.filter(this.scope.model.items, function (x) { return x.selected; }), 'id');
                    return results;
                };

                ListControllerBase.prototype.setSelected = function (selected) {
                    $(this.scope.model.items).each(function (d, ditem) {
                        ditem.selected = selected.indexOf(ditem.id) !== -1;
                    });
                };

                ListControllerBase.prototype.requested = function () {
                    var selected = this.getSelected();
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, selected);
                };

                ListControllerBase.prototype.selected = function (selected) {
                    this.scope.$emit(this.ctor.MODAL_EVENTS.valueSubmitted, this.select(selected));
                };

                ListControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    var resolve = function (data) {
                        self.scope.loading = false;
                        deferred.resolve(data);
                    };

                    var reject = function (ex) {
                        self.scope.loading = false;
                        deferred.reject(ex);
                    };

                    controllers.ControllerBase.prototype.init.apply(this, arguments).then(function () {
                        self.scope.loading = true;

                        if (!self.scope.denied) {
                            self.run('preloading').then(function () {
                                self.preload().then(function () {
                                    self.run('preloaded').then(function () {
                                        self.run('loading').then(function () {
                                            self.load().then(function (response) {
                                                self.scope.found = true;
                                                self.run('loaded', [response]).then(function () {
                                                    self.run('setting', [response]).then(function () {
                                                        self.set(response).then(function (setted) {
                                                            self.run('set', [response]).then(function () {
                                                                self.run('watch').then(function () {
                                                                    self.getBreadcrumb().then(function (breadcrumb) {
                                                                        self.setBreadcrumb(breadcrumb).then(function () {
                                                                            resolve(setted);
                                                                        }).catch(reject);
                                                                    }).catch(reject);
                                                                }).catch(reject);
                                                            }).catch(reject);
                                                        }).catch(reject);
                                                    }).catch(reject);
                                                }).catch(reject);
                                            }).catch(function (loadError) {
                                                var parsedLoadError = _.isString(loadError) ? JSON.parse(loadError) : loadError;
                                                if (_.isObject(parsedLoadError) && parsedLoadError.statusCode === 404) {
                                                    self.scope.found = false;
                                                    resolve();
                                                }
                                                else {
                                                    reject(loadError)
                                                }
                                            });
                                        }).catch(reject);
                                    }).catch(reject);
                                }).catch(reject);
                            }).catch(reject);
                        }
                        else {
                            resolve();
                        }

                    }).catch(reject);
                    
                    return deferred.promise;
                };

                return ListControllerBase;

            })(controllers.ListControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});
})();