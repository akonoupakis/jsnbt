﻿/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ListControllerBase = (function (ListControllerBase) {

                ListControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.localization = true;

                    $scope.title = undefined;
                    $scope.model = {};

                    $scope.found = undefined;

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

                ListControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

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
                                                                            self.scope.loading = false;
                                                                            deferred.resolve(setted);
                                                                        }).catch(function (setBreadcrumbError) {
                                                                            self.scope.loading = false;
                                                                            deferred.reject(setBreadcrumbError);
                                                                        });
                                                                    }).catch(function (getBreadcrumbError) {
                                                                        self.scope.loading = false;
                                                                        deferred.reject(getBreadcrumbError);
                                                                    });
                                                                }).catch(function (watchError) {
                                                                    self.scope.loading = false;
                                                                    deferred.reject(watchError);
                                                                });
                                                            }).catch(function (setError) {
                                                                self.scope.loading = false;
                                                                deferred.reject(setError);
                                                            });
                                                        }).catch(function (settedError) {
                                                            self.scope.loading = false;
                                                            deferred.reject(settedError);
                                                        });
                                                    }).catch(function (settingError) {
                                                        self.scope.loading = false;
                                                        deferred.reject(settingError);
                                                    });
                                                }).catch(function (loadedError) {
                                                    self.scope.loading = false;
                                                    deferred.reject(loadedError);
                                                });
                                            }).catch(function (loadError) {
                                                var parsedLoadError = _.isString(loadError) ? JSON.parse(loadError) : loadError;
                                                if (_.isObject(parsedLoadError) && parsedLoadError.statusCode === 404) {
                                                    self.scope.found = false;
                                                    self.scope.loading = false;
                                                    deferred.resolve();
                                                }
                                                else {
                                                    self.scope.loading = false;
                                                    deferred.reject(loadError);
                                                }
                                            });
                                        }).catch(function (loadingError) {
                                            self.scope.loading = false;
                                            deferred.reject(loadingError);
                                        });
                                    }, function (preloadedError) {
                                        self.scope.loading = false;
                                        deferred.reject(preloadedError);
                                    });
                                }).catch(function (preloadError) {
                                    self.scope.loading = false;
                                    deferred.reject(preloadError);
                                });
                            }).catch(function (preloadingError) {
                                self.scope.loading = false;
                                deferred.reject(preloadingError);
                            });
                        }
                        else {
                            self.scope.loading = false;
                            deferred.resolve();
                        }

                    }).catch(function (initError) {
                        self.scope.loading = false;
                        deferred.reject(initError);
                    });
                    
                    return deferred.promise;
                };

                return ListControllerBase;

            })(controllers.ListControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});
})();