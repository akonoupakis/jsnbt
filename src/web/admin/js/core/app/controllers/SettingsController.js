/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('SettingsController', function ($scope, $rootScope, $location, $route, $timeout, $q, $logger, $queue, $data, $jsnbt, ScrollSpyService, LocationService, FORM_EVENTS) {
            
            var logger = $logger.create('SettingsController');

            $scope.domain = $route.current.$$route.domain;
            $scope.name = ($scope.domain !== 'core' ? ($scope.domain + ' ') : '') + 'settings';

            $scope.id = undefined;
            $scope.settings = {};

            $scope.valid = false;
            $scope.published = false;

            $scope.domainTmpl = $route.current.$$route.tmpl;
            $scope.publicTmpl = $jsnbt.specs.settings;

            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.settings.get({ domain: $scope.domain }).then(function (results) {
                        var first = _.first(results)
                        if (first) {
                            $scope.id = first.id;
                            $scope.settings = first.data;
                        }
                        else {
                            $scope.id = undefined;
                            $scope.settings = {};
                        }
                        
                        $scope.valid = true;

                        $scope.published = true;

                        deferred.resolve(first);

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
                    $scope.$broadcast(FORM_EVENTS.initiateValidation);

                    deferred.resolve($scope.valid);

                    return deferred.promise;
                },

                publish: function (cb) {
                    var deferred = $q.defer();

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            deferred.resolve(false);
                        }
                        else {
                            if ($scope.id) {
                                $data.settings.put($scope.id, {
                                    data: $scope.settings
                                }).then(function (result) {
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.settings.post({
                                    domain: $scope.domain,
                                    data: $scope.settings
                                }).then(function (result) {
                                    $scope.id = result.id;
                                    $scope.settings = result.data;
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                        }
                    });

                    return deferred.promise;
                }

            };


            $scope.back = function () {
                if ($scope.current.breadcrumb[0].name === 'addons') {
                    $location.previous('/addons/' + $scope.domain);
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

            $scope.$on(FORM_EVENTS.valueChanged, function (sender) {
                sender.stopPropagation();

                fn.save().then(function () {
                    $scope.published = false;
                }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$on(FORM_EVENTS.valueIsValid, function (sender, value) {
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