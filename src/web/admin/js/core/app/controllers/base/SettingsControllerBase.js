/* global angular:false */

(function () {
    "use strict";

    jsnbt.SettingsControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

        var logger = $logger.create('SettingsControllerBase');
        
        $scope.domain = $route.current.$$route.domain;
        $scope.tmpl = $route.current.$$route.tmpl;

        $scope.settingsId = undefined;
        $scope.settings = {};

        $scope.valid = true;

        $scope.published = true;
        $scope.draft = false;

        $scope.load = function () {
            var deferred = $q.defer();

            $data.settings.get({ domain: $scope.domain }).then(function (results) {
                var domainSettings = _.first(_.filter(results, function (x) { return x.domain === $scope.domain; }));
                
                if (domainSettings) {
                    $scope.set(domainSettings.id, domainSettings.data);
                }
                else {
                    $scope.set(undefined, {});
                }

                $scope.setValid(true);

                $scope.setPublished(true);

                deferred.resolve();

            }, function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        $scope.set = function (id, data) {
            $scope.settingsId = id;
            $scope.settings = data;
        };

        $scope.get = function () {
            return $scope.settings;
        };

        $scope.setLocation = function () {
            var breadcrumb = LocationService.getBreadcrumb();
            $scope.current.setBreadcrumb(breadcrumb);
        };

        $scope.setSpy = function (time) {
            ScrollSpyService.get(time || 0).then(function (response) {
                $scope.nav = response;
            });
        };

        $scope.setValid = function (value) {
            $scope.valid = value;
        };

        $scope.isValid = function () {
            return $scope.valid;
        };

        $scope.setPublished = function (value) {
            $scope.published = value;
            $scope.draft = !value;
        };

        $scope.setSpy = function (time) {
            var deferred = $q.defer();

            ScrollSpyService.get(time || 0).then(function (response) {
                $scope.nav = response;
                deferred.resolve(response);
            });

            return deferred.promise;
        };

        $scope.validate = function () {
            var deferred = $q.defer();

            $scope.setValid(true);
            $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

            deferred.resolve($scope.isValid());

            return deferred.promise;
        };

        $scope.back = function () {
            $location.previous($scope.current.breadcrumb[$scope.current.breadcrumb.length - 2].url);
        };

        $scope.discard = function () {
            $scope.load().then(function (response) {

            }, function (error) {
                logger.error(ex);
            });
        };

        $scope.publish = function () {

            var publishFn = function () {
                var deferred = $q.defer();

                var saveSettings = function () {
                    var deferredInternal = $q.defer();

                    if ($scope.settingsId) {
                        $data.settings.put($scope.settingsId, {
                            data: $scope.settings
                        }).then(function (result) {
                            deferredInternal.resolve(true);
                        }, function (error) {
                            deferredInternal.reject(error);
                        });
                    }
                    else {
                        $data.settings.post({
                            domain: $scope.domain,
                            data: $scope.settings
                        }).then(function (result) {
                            $scope.set(result.id, result.data);
                            deferredInternal.resolve(true);
                        }, function (error) {
                            deferredInternal.reject(error);
                        });
                    }

                    return deferredInternal.promise;
                }

                $scope.validate().then(function (validationResults) {
                    if (!validationResults) {
                        deferred.resolve(false);
                    }
                    else {
                        saveSettings().then(function () {
                            deferred.resolve(true);
                        }, function (ex) {
                            deferred.reject(ex);
                        });
                    }
                });

                return deferred.promise;
            }

            publishFn().then(function (success) {
                $scope.published = success;

                if (!success)
                    $scope.scroll2error();
            }, function (ex) {
                throw ex;
            });
        };

        $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
            sender.stopPropagation();

            $scope.published = false;
        });

        $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
            sender.stopPropagation();

            if (!value)
                $scope.valid = false;
        });

        $scope.init = function () {
            var deferred = $q.defer();

            $scope.load().then(function () {
                $scope.setSpy().then(function () {
                    deferred.resolve();
                }, function (ex) {
                    deferred.reject(ex);
                });
            }, function (ex) {
                logger.error(ex);
                deferred.reject(ex);
            });

            return deferred.promise;
        };
    };

    angular.module("jsnbt")
        .controller('SettingsControllerBase', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', jsnbt.SettingsControllerBase]);
})();