/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ListControllerBase = (function (ListControllerBase) {

                ListControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var self = this;

                    $scope.localization = true;

                    $scope.title = undefined;
                    $scope.data = {};

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

                    this.scope.data = data;

                    deferred.resolve(this.scope.data);

                    return deferred.promise;
                };

                ListControllerBase.prototype.get = function () {
                    
                    return this.scope.data;

                };

                ListControllerBase.prototype.setTitle = function (title) {
                    this.scope.title = title;
                };

                ListControllerBase.prototype.remove = function (item) {
                    this.scope.data.items = _.filter(this.scope.data.items, function (x) { return x.id !== item.id; });
                };

                ListControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    controllers.ControllerBase.prototype.init.apply(this, arguments).then(function () {

                        self.run('preloading').then(function () {
                            self.preload().then(function () {
                                self.run('preloaded').then(function () {
                                    self.run('loading').then(function () {
                                        self.load().then(function (response) {
                                            self.run('loaded', [response]).then(function () {
                                                self.run('setting', [response]).then(function () {
                                                    self.set(response).then(function (setted) {
                                                        self.run('set', [response]).then(function () {
                                                            self.run('watch').then(function () {
                                                                self.getBreadcrumb().then(function (breadcrumb) {
                                                                    self.setBreadcrumb(breadcrumb).then(function () {
                                                                        deferred.resolve(setted);
                                                                    }).catch(function (setBreadcrumbError) {
                                                                        deferred.reject(setBreadcrumbError);
                                                                    });
                                                                }).catch(function (getBreadcrumbError) {
                                                                    deferred.reject(getBreadcrumbError);
                                                                });
                                                            }).catch(function (watchError) {
                                                                deferred.reject(watchError);
                                                            });
                                                        }).catch(function (setError) {
                                                            deferred.reject(setError);
                                                        });
                                                    }).catch(function (settedError) {
                                                        deferred.reject(settedError);
                                                    });
                                                }).catch(function (settingError) {
                                                    deferred.reject(settingError);
                                                });
                                            }).catch(function (loadedError) {
                                                deferred.reject(loadedError);
                                            });
                                        }).catch(function (loadError) {
                                            deferred.reject(loadError);
                                        });
                                    }).catch(function (loadingError) {
                                        deferred.reject(loadingError);
                                    });
                                }, function (preloadedError) {
                                    deferred.reject(preloadedError);
                                });
                            }).catch(function (preloadError) {
                                deferred.reject(preloadError);
                            });
                        }).catch(function (preloadingError) {
                            deferred.reject(preloadingError);
                        });

                    }).catch(function (initError) {
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