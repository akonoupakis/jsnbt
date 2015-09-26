/* global angular:false */

(function () {
    "use strict";

    jsnbt.DataFormControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('DataFormControllerBase');

        $scope.list = _.find($jsnbt.lists, function (x) { return x.domain === $scope.domain && x.id === $route.current.$$route.list; });
        
        $scope.item = undefined;

        $scope.tmpl = $scope.list.form;

        $scope.queue = {
            preload: [],
            load: [],
            set: [],
            patch: []
        };

        $scope.enqueue = function (key, fn) {
            if ($scope.queue[key])
                $scope.queue[key].push(fn);
        };

        $scope.preload = function () {
            var deferred = $q.defer();

            $q.all(_.map($scope.queue.preload, function (x) { return x(); })).then(function () {
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            });
            
            return deferred.promise;
        };

        $scope.load = function () {

            var deferred = $q.defer();

            $scope.localized = $scope.application.localization.enabled && ($scope.list.localized === undefined || $scope.list.localized === true);

            $scope.languages = $scope.application.languages;
            $scope.language = $scope.application.localization.enabled ? ($scope.defaults.language ? $scope.defaults.language : _.first($scope.application.languages).code) : 'en';

            if ($scope.isNew()) {
                $scope.setName('');

                $scope.set($data.create('data', {
                    domain: $scope.domain,
                    list: $scope.list.id
                }));

                $scope.setValid(true);
                $scope.setPublished(false);

                deferred.resolve();
            }
            else {
                $data.data.get($scope.id).then(function (result) {

                    $scope.setName(result.title[$scope.defaults.language]);
                    $scope.set(result);

                    $scope.setValid(true);
                    $scope.setPublished(true);

                    deferred.resolve();

                }, function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;

        };

        $scope.set = function (data) {
            $scope.item = data;
        };

        $scope.get = function () {
            return $scope.item;
        };

        $scope.discard = function () {
            $scope.load().then(function (response) {
                
            }, function (error) {
                throw error;
            });
        };

        $scope.validate = function () {
            var deferred = $q.defer();

            $scope.setValid(true);
            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

            if (!$scope.isValid()) {
                deferred.resolve(false);
            }
            else {
                if ($scope.localized) {
                    var checkLanguage = function (lang, next) {
                        $scope.language = lang.code;

                        $timeout(function () {
                            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

                            if (!$scope.isValid()) {
                                deferred.resolve(false);
                            }
                            else {
                                next();
                            }
                        }, 50);
                    };

                    var currentLanguage = $scope.language;
                    var restLanguages = _.filter($scope.languages, function (x) { return x.active && x.code !== currentLanguage; });
                    if (restLanguages.length > 0) {
                        var nextIndex = 0;
                        var next = function () {
                            nextIndex++;

                            var lang = restLanguages[nextIndex];
                            if (lang) {
                                checkLanguage(lang, next);
                            }
                            else {
                                $scope.language = currentLanguage;

                                deferred.resolve(true);
                            }
                        };

                        var first = _.first(restLanguages);
                        checkLanguage(first, next);
                    }
                    else {
                        deferred.resolve(true);
                    }
                }
                else {
                    deferred.resolve(true);
                }
            }

            return deferred.promise;
        };

        $scope.publish = function () {

            var publish = function () {
                var deferred = $q.defer();

                $scope.validate().then(function (validationResults) {
                    if (!validationResults) {
                        deferred.resolve(false);
                    }
                    else {
                        if ($scope.isNew()) {
                            $data.data.post($scope.item).then(function (result) {
                                $scope.id = result.id;
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                        else {
                            $data.data.put($scope.id, $scope.item).then(function (result) {
                                $scope.setName(result.title[$scope.defaults.language]);
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    }
                });

                return deferred.promise;
            }
            
            publish().then(function (success) {
                $scope.published = success;

                if (!success) {
                    $scope.scroll2error();
                }
                else {
                    if ($scope.isNew()) {
                        var targetUrl = $scope.current.breadcrumb[$scope.current.breadcrumb.length - 2].url + '/' + $scope.id;
                        $location.goto(targetUrl);
                    }
                }
            }, function (ex) {
                logger.error(ex);
            });
        };

        $scope.init = function () {
            var deferred = $q.defer();

            $timeout(function () {
                $scope.preload().then(function () {
                    $scope.load().then(function () {
                        $scope.setSpy(200)
                        deferred.resolve();
                    }, function (setError) {
                        logger.error(setError);
                        deferred.reject(setError);
                    });
                }, function (setError) {
                    logger.error(setError);
                    deferred.reject(setError);
                });

            }, 200);

            return deferred.promise;
        };

    };
    jsnbt.DataFormControllerBase.prototype = Object.create(jsnbt.FormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('DataFormControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.DataFormControllerBase]);
})();