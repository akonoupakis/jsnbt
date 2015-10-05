﻿/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

                if (_.isObject($route.current.$$route.scope))
                    for (var scopeProperty in $route.current.$$route.scope)
                        $scope[scopeProperty] = $route.current.$$route.scope[scopeProperty];

                var logger = $logger.create('ControllerBase');

                $scope.localization = false; 
                $scope.languages = []; 
                $scope.language = ''; 

                $scope.breadcrumb = true;
                $scope.queue = {};

                $scope.enqueue = function (key, fn) {
                    if (!$scope.queue[key])
                        $scope.queue[key] = [];

                    $scope.queue[key].push(fn);
                }

                $scope.run = function (key, args) {
                    var deferred = $q.defer();

                    if ($scope.queue[key]) {
                        $q.all(_.map($scope.queue[key], function (x) { return x.apply(x, args); })).then(function () {
                            deferred.resolve();
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                $scope.back = function () {
                    $scope.current.breadcrumb.items.pop();
                    var lastItem = _.last($scope.current.breadcrumb.items);
                    if (lastItem) {
                        $location.previous(lastItem.url);
                    }
                    else {
                        logger.warn('previous breadcrumb item not found. implement the back() function to override');
                    }
                };

                $scope.getBreadcrumb = function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();

                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                };

                $scope.setBreadcrumb = function (breadcrumb) {
                    var deferred = $q.defer();

                    $scope.current.setBreadcrumb(breadcrumb);
                    deferred.resolve();

                    return deferred.promise;
                };

                $scope.goto = function (path) {
                    $location.goto(path);
                };

                $scope.previous = function (path) {
                    $location.previous(path);
                };

                $scope.next = function (path) {
                    $location.next(path);
                };
                
                $scope.init = function () {
                    var deferred = $q.defer();
                    
                    var proceed = function () {

                        $scope.localization = $scope.application.localization.enabled;
                        $scope.languages = _.map($scope.application.languages, function (x) {
                            x.image = 'img/core/flags/' + x.code + '.png';
                            return x;
                        });
                        
                        $scope.getBreadcrumb().then(function (breadcrumb) {
                            $scope.setBreadcrumb(breadcrumb).then(function () {
                                deferred.resolve();
                            }).catch(function (ex) {
                                deferred.reject(ex);
                            });
                        });
                    };

                    if ($scope.$parent && $scope.root && typeof ($scope.$parent.init) === 'function') {
                        $scope.$parent.init().then(function () {
                            proceed();
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });
                    }
                    else {
                        deferred.reject(new Error('ControllerBase should have the AppController as base'));
                    }

                    return deferred.promise;
                };

            };

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();