/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ListControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                controllers.ControllerBase.apply(this, $rootScope.getBaseArguments($scope));
                                
                $scope.title = undefined;
                $scope.data = {};

                $scope.preload = function () {
                    var deferred = $q.defer();

                    deferred.resolve();

                    return deferred.promise;
                };

                $scope.load = function () {
                    throw new Error('not implemented');
                };

                $scope.set = function (data) {
                    var deferred = $q.defer();

                    $scope.data = data;

                    deferred.resolve($scope.data);

                    return deferred.promise;
                };

                $scope.setTitle = function (title) {
                    $scope.title = title;
                };

                $scope.remove = function (item) {
                    $scope.data.items = _.filter($scope.data.items, function (x) { return x.id !== item.id; });
                };

                $scope.enqueue('watch', function () {
                    var deferred = $q.defer();

                    $scope.$watch('title', function (newValue, prevValue) {
                        if (newValue !== prevValue && newValue !== undefined) {
                            $scope.getBreadcrumb().then(function (breadcrumb) {
                                $scope.setBreadcrumb(breadcrumb).catch(function (setBreadcrumbError) {
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


                var initFn = $scope.init;
                $scope.init = function () {
                    var deferred = $q.defer();
                    
                    initFn().then(function () {

                        $scope.run('preloading').then(function () {
                            $scope.preload().then(function () {
                                $scope.run('preloaded').then(function () {
                                    $scope.run('loading').then(function () {
                                        $scope.load().then(function (response) {
                                            $scope.run('loaded', [response]).then(function () {
                                                $scope.run('setting', [response]).then(function () {
                                                    $scope.set(response).then(function (setted) {
                                                        $scope.run('set', [response]).then(function () {
                                                            $scope.run('watch').then(function () {
                                                                $scope.getBreadcrumb().then(function (breadcrumb) {
                                                                    $scope.setBreadcrumb(breadcrumb).then(function () {
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

            };
            controllers.ListControllerBase.prototype = Object.create(controllers.ControllerBase.prototype);

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});
})();