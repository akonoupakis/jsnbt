/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('SettingsController', function ($scope, $rootScope, $location, $route, $timeout, $q, $logger, $queue, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
            
            var logger = $logger.create('SettingsController');

            $scope.domain = 'core';
            $scope.name = ($scope.domain !== 'core' ? ($scope.domain + ' ') : '') + 'settings';
            
            $scope.settingsId = undefined;
            $scope.settings = {};
            $scope.mySettingsId = undefined;
            $scope.mySettings = {};

            $scope.valid = false;
            $scope.published = false;

            var injects = [];
            _.each($jsnbt.injects, function (inject) {
                if (inject.settings)
                    injects.push(inject.settings);
            });
            $scope.injects = injects;

            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.settings.get({ domain: { $in: [$scope.domain, 'public'] } }).then(function (results) {
                        var domainSettings = _.first(_.filter(results, function (x) { return x.domain === $scope.domain; }));
                        if (domainSettings) {
                            $scope.settingsId = domainSettings.id;
                            $scope.settings = domainSettings.data;
                        }
                        else {
                            $scope.settingsId = undefined;
                            $scope.settings = {};
                        }

                        if ($scope.domain === 'core') {
                            var publicSettings = _.first(_.filter(results, function (x) { return x.domain === 'public'; }));
                            if (publicSettings) {
                                $scope.mySettingsId = publicSettings.id;
                                $scope.mySettings = publicSettings.data;
                            }
                            else {
                                $scope.mySettingsId = undefined;
                                $scope.mySettings = {};
                            }
                        }
                        else {
                            $scope.mySettings = {};
                        }
                        
                        $scope.valid = true;

                        $scope.published = true;

                        deferred.resolve();

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();

                    $scope.current.setBreadcrumb(breadcrumb);

                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                },

                setSpy: function (time) {
                    var deferred = $q.defer();

                    ScrollSpyService.get(time || 0).then(function (response) {
                        $scope.nav = response;
                        deferred.resolve(response);
                    });

                    return deferred.promise;
                },

                save: function () {
                    var deferred = $q.defer();

                    $scope.published = false;

                    deferred.resolve();

                    return deferred.promise;
                },
                
                validate: function () {
                    var deferred = $q.defer();

                    $scope.valid = true;
                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

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
                                $scope.settingsId = result.id;
                                $scope.settings = result.data;
                                deferredInternal.resolve(true);
                            }, function (error) {
                                deferredInternal.reject(error);
                            });
                        }

                        return deferredInternal.promise;
                    }

                    var saveMySettings = function () {
                        var deferredInternal = $q.defer();

                        if ($scope.mySettingsId) {
                            $data.settings.put($scope.mySettingsId, {
                                data: $scope.mySettings
                            }).then(function (result) {
                                deferredInternal.resolve(true);
                            }, function (error) {
                                deferredInternal.reject(error);
                            });
                        }
                        else {
                            $data.settings.post({
                                domain: 'public',
                                data: $scope.mySettings
                            }).then(function (result) {
                                $scope.mySettingsId = result.id;
                                $scope.mySettings = result.data;
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
                            $q.all(saveSettings(), saveMySettings()).then(function () {
                                deferred.resolve(true);
                            }, function (ex) {
                                deferred.reject(ex);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };


            $scope.back = function () {
                if ($scope.current.breadcrumb[0].name === 'modules') {
                    $location.previous('/modules/' + $scope.domain);
                }
                else {
                    $location.previous('/');
                }
            };

            $scope.discard = function () {
                fn.set().then(function () {
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;

                    if (!success) 
                        $scope.scroll2error();
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.$on(CONTROL_EVENTS.valueChanged, function (sender) {
                sender.stopPropagation();

                fn.save().then(function () {
                    $scope.published = false;
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on(CONTROL_EVENTS.valueIsValid, function (sender, value) {
                sender.stopPropagation();

                if (!value)
                    $scope.valid = false;
            });


            $timeout(function () {
                fn.set().then(function () {
                    fn.setSpy(200);
                }, function (ex) {
                    logger.error(ex);
                });
            }, 200);


            var section = $route.current.$$route.section;
        });
})(); 