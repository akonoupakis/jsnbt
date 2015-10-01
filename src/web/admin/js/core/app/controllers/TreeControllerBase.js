/* global angular:false */

(function () {
    "use strict";
    
    jsnbt.TreeControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.ControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.nodes = [];

        $scope.preload = function () {
            var deferred = $q.defer();

            deferred.resolve();
            
            return deferred.promise;
        };

        $scope.load = function () {
            var deferred = $q.defer();

            TreeNodeService.getNodes({
                identifier: $scope.cacheKey,
                domain: $scope.domain,
                entities: $scope.entities,
                parentId: '',
                parentIds: []
            }).then(function (response) {
                deferred.resolve(response);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };

        $scope.set = function (data) {
            var deferred = $q.defer();

            $scope.nodes = data;

            deferred.resolve($scope.nodes);

            return deferred.promise;
        };
        
        $scope.remove = function (node) {
            if (node.parent.id === '') {
                $scope.nodes[0].children = _.filter($scope.nodes[0].children, function (x) { return x.id !== node.id; });
                $scope.nodes[0].childCount = $scope.nodes[0].children.length;
            }
            else {
                node.parent.children = _.filter(node.parent.children, function (x) { return x.id !== node.id; });
                node.parent.childCount = node.parent.children.length;

                if (node.parent.childCount === 0)
                    node.parent.collapsed = true;
            }
        };

        $scope.init = function () {
            var deferred = $q.defer();

            $scope.run('preloading').then(function () {
                $scope.preload().then(function () {
                    $scope.run('preloaded').then(function () {
                        $scope.run('loading').then(function () {
                            $scope.load().then(function (response) {
                                $scope.run('loaded', [response]).then(function () {
                                    $scope.run('setting', [response]).then(function () {
                                        $scope.set(response).then(function (setted) {
                                            $scope.run('set', [setted]).then(function () {
                                                $scope.run('watch').then(function () {
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
            
            return deferred.promise;
        };


    };
    jsnbt.TreeControllerBase.prototype = Object.create(jsnbt.ControllerBase.prototype);

})();