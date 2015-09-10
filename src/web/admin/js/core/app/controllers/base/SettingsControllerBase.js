/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('SettingsControllerBase', ['$scope', '$controller', '$route', '$rootScope', '$routeParams', '$location', '$data', '$q', '$timeout', '$jsnbt', '$fn', 'AuthService', 'TreeNodeService', 'LocationService', 'ScrollSpyService', 'ModalService', 'DATA_EVENTS', 'CONTROL_EVENTS',
            function ($scope, $controller, $route, $rootScope, $routeParams, $location, $data, $q, $timeout, $jsnbt, $fn, AuthService, TreeNodeService, LocationService, ScrollSpyService, ModalService, DATA_EVENTS, CONTROL_EVENTS) {
           
            $scope.domain = $route.current.$$route.domain;

            if (!$scope.domain)
                throw new Error('settings domain is undefined');

            $scope.settingsId = undefined;
            $scope.settings = {};
                      
            $scope.valid = true;

            $scope.published = true;
            $scope.draft = false;

            var fn = {

                set: function () {
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
                },
                
                validate: function () {
                    var deferred = $q.defer();

                    $scope.validate();

                    deferred.resolve($scope.valid);

                    return deferred.promise;
                },

                publish: function (cb) {
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

                    this.validate().then(function (validationResults) {
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

            };

            $scope.load = fn.set;

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

            $scope.validate = function () {
                $scope.setValid(true);
                $scope.$broadcast(CONTROL_EVENTS.initiateValidation);
            };

            $scope.back = function () {
                throw new Error('not implemented: back()');
            };

            $scope.discard = function () {
                fn.set().then(function () {
                }, function (ex) {
                    throw ex;
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
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
        }]);
})();