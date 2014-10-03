﻿/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('UserController', function ($scope, $routeParams, $location, $timeout, $q, $logger, $data, ScrollSpyService, LocationService, FORM_EVENTS) {
           
            var logger = $logger.create('UserController');

            $scope.id = $routeParams.id;
            $scope.name = undefined;
            $scope.user = undefined;

            $scope.valid = false;
            $scope.published = false;
            
            var fn = {

                set: function () {
                    var deferred = $q.defer();
                    
                    $data.users.get($scope.id).then(function (result) {

                        $scope.name = result.firstName + ' ' + result.lastName;
                        $scope.user = result;
    
                        $scope.valid = true;

                        $scope.published = true;

                        deferred.resolve(result);

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setLocation: function () {
                    var deferred = $q.defer();

                    var breadcrumb = LocationService.getBreadcrumb();
                    if ($scope.user) {
                        breadcrumb = breadcrumb.slice(0, breadcrumb.length - 1);
                        breadcrumb.push({
                            name: $scope.user.username,
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

                validate: function () {
                    var deferred = $q.defer();

                    $scope.valid = true;
                    $scope.$broadcast(FORM_EVENTS.initiateValidation);

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
                            $data.users.put($scope.id, $scope.user).then(function (result) {
                                $scope.name = result.firstName + ' ' + result.lastName;
                                deferred.resolve(true);
                            }, function (error) {
                                deferred.reject(error);
                            });
                        }
                    });

                    return deferred.promise;
                }

            };


            $scope.back = function () {
                $location.previous('/users');
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