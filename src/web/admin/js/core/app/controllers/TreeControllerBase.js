/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.TreeControllerBase = (function (TreeControllerBase) {

                TreeControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    $scope.localization = true;

                    $scope.nodes = [];

                };
                TreeControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

                TreeControllerBase.prototype.preload = function () {
                    var deferred = this.ctor.$q.defer();

                    deferred.resolve();

                    return deferred.promise;
                };

                TreeControllerBase.prototype.load = function () {
                    var deferred = this.ctor.$q.defer();

                    this.ctor.TreeNodeService.getNodes({
                        identifier: this.scope.cacheKey,
                        domain: this.scope.domain,
                        entities: this.scope.entities,
                        parentId: '',
                        parentIds: []
                    }).then(function (response) {
                        deferred.resolve(response);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                TreeControllerBase.prototype.set = function (data) {
                    var deferred = this.ctor.$q.defer();

                    this.scope.nodes = data;

                    deferred.resolve(this.scope.nodes);

                    return deferred.promise;
                };

                TreeControllerBase.prototype.remove = function (node) {
                    if (node.parent.id === '') {
                        this.scope.nodes[0].children = _.filter(this.scope.nodes[0].children, function (x) { return x.id !== node.id; });
                        this.scope.nodes[0].childCount = this.scope.nodes[0].children.length;
                    }
                    else {
                        node.parent.children = _.filter(node.parent.children, function (x) { return x.id !== node.id; });
                        node.parent.childCount = node.parent.children.length;

                        if (node.parent.childCount === 0)
                            node.parent.collapsed = true;
                    }
                };

                TreeControllerBase.prototype.init = function () {
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
                                                        self.run('set', [setted]).then(function () {
                                                            self.run('watch').then(function () {
                                                                deferred.resolve(setted);
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

                return TreeControllerBase;

            })(controllers.TreeControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();