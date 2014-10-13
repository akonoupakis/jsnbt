﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TextController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $queue, $q, $data, ScrollSpyService, LocationService, FORM_EVENTS) {
           
            var logger = $logger.create('TextController');

            $scope.id = $routeParams.id;
            $scope.name = undefined;
            $scope.text = undefined;

            $scope.siblingKeys = [];
            $scope.languages = [];

            $scope.valid = true;
            $scope.validation = {
                key: true
            };

            $scope.published = true;


            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.texts.get($scope.id).then(function (result) {

                        $scope.name = result.key;
                        $scope.text = result;

                        $scope.languages = $scope.application.localization.enabled ? $scope.application.languages : _.filter($scope.application.languages, function (x) { return x.code === 'en'; });
                        
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
                    breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
                    breadcrumb.push({
                        name: $scope.name,
                        active: true
                    });
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
                    $scope.validation.key = true;

                    $scope.$broadcast(FORM_EVENTS.initiateValidation);

                    if ($scope.valid) {

                        $data.texts.get({ id: { $nin: [$scope.id] }, $fields: { key: true } }).then(function (siblingsResponse) {

                            $scope.siblingKeys = _.pluck(siblingsResponse, 'key');

                            if ($scope.siblingKeys.indexOf($scope.text.key) === -1) {
                                $scope.valid = true;
                                $scope.validation.key = true;
                            }
                            else {
                                $scope.valid = false;
                                $scope.validation.key = false;
                            }

                            deferred.resolve($scope.valid);
                        }, function (siblingsError) {
                            deferred.reject(siblingsError);
                        });

                    }
                    else {
                        deferred.resolve(false);
                    }

                    return deferred.promise;
                },

                publish: function () {
                    var deferred = $q.defer();

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            deferred.resolve(false);
                        }
                        else {
                            $data.texts.put($scope.id, $scope.text).then(function (result) {
                                $scope.name = result.key;
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };

            $scope.validateKey = function (value) {
                var valid = true;

                valid = $scope.siblingKeys.indexOf(value) === -1;
                $scope.validation.key = valid;

                return valid;
            };


            $scope.back = function () {
                $location.previous('/content/texts');
            };

            $scope.discard = function () {
                fn.discard().then(function () {
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

            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().then(function () { }, function (ex) {
                    logger.error(ex);
                });
            });

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
                      
        });
})();