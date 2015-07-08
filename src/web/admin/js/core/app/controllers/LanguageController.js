﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('LanguageController', ['$scope', '$routeParams', '$location', '$timeout', '$q', '$logger', '$data', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', function ($scope, $routeParams, $location, $timeout, $q, $logger, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
           
            var logger = $logger.create('LanguageController');

            $scope.id = $routeParams.id;
            $scope.new = $scope.id === 'new';
            $scope.name = undefined;
            $scope.language = undefined;
            $scope.languages = [];

            $scope.valid = false;
            $scope.published = true;
            $scope.draft = false;
            
            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    if ($scope.new) {
                        $scope.name = '';

                        $scope.language = $data.create('languages', {
                            code: '',
                            active: false,
                            default: false,
                        });

                        var activeLanguageCodes = _.pluck($scope.application.languages, 'code');
                        $scope.languages = _.filter($scope.defaults.languages, function (x) { return activeLanguageCodes.indexOf(x.code) === -1; });

                        $scope.valid = true;

                        $scope.published = false;
                        $scope.draft = true;

                        deferred.resolve();
                    }
                    else {
                        $data.languages.get($scope.id).then(function (result) {

                            $scope.name = result.name;
                            $scope.language = result;

                            $scope.languages = $scope.defaults.languages;

                            $scope.valid = true;

                            $scope.published = true;
                            $scope.draft = false;

                            deferred.resolve();

                        }, function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
                    if ($scope.new) {
                        breadcrumb.push({
                            name: 'new',
                            active: true
                        });
                    }
                    else {
                        breadcrumb.push({
                            name: $scope.name,
                            active: true
                        });
                    }
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

                discard: function () {
                    var deferred = $q.defer();

                    this.set().then(function (response) {
                        deferred.resolve();
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                validate: function () {
                    var deferred = $q.defer();

                    $scope.valid = true;
                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

                    deferred.resolve($scope.valid);

                    return deferred.promise;
                },

                publish: function () {
                    var deferred = $q.defer();

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            deferred.resolve(false);
                        }
                        else {
                            if ($scope.new) {
                                $data.languages.post($scope.language).then(function (result) {
                                    $scope.id = result.id;
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.languages.put($scope.id, {
                                    active: $scope.language.active
                                }).then(function (result) {
                                    $scope.name = result.name;
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
                $location.previous('/content/languages');
            };

            $scope.discard = function () {
                fn.discard().catch(function (ex) {
                    logger.error(ex);
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success) {
                    $scope.published = success;

                    if (!success) {
                        $scope.scroll2error();
                    }
                    else {
                        if ($scope.new) {
                            $location.goto('/content/languages/' + $scope.id);
                        }
                    }
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

            $scope.$watch('language.code', function (newValue, prevValue) {
                var language = _.find($scope.defaults.languages, function (x) { return x.code === newValue });
                if (language)
                    $scope.language.name = language.name;
            });

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
                    fn.setSpy(200).catch(function (spyEx) {
                        logger.error(spyEx);
                    });
                }, function (ex) {
                    logger.error(ex);
                });
            }, 200);
        }]);
})();