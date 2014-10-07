/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TextController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $queue, $q, $data, ScrollSpyService, LocationService, DraftService, FORM_EVENTS) {
           
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

            $scope.published = false;


            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $data.texts.get($scope.id).then(function (result) {

                        var setInternal = function (published, data) {
                            $scope.name = data.key;
                            $scope.text = data;

                            $scope.languages = $scope.application.languages;

                            $scope.valid = true;
                            $scope.published = published;

                            deferred.resolve();
                        };

                        DraftService.get('texts', $scope.id).then(function (draftResult) {
                            setInternal(draftResult === undefined, draftResult || result);
                        }, function (draftError) {
                            deferred.reject(draftError);
                        });

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

                    $queue.enqueue('TextController:' + $scope.id + ':save', function () {
                        var d = $q.defer();
                        DraftService.set('texts', $scope.id, $scope.text).then(function (response) {
                            d.resolve(response);
                        }, function (error) {
                            d.reject(error);
                        });
                        return d.promise;
                    });
                    
                    deferred.resolve();

                    return deferred.promise;
                },

                discard: function () {
                    var deferred = $q.defer();

                    DraftService.clear('texts', $scope.id).then(function (response) {
                        deferred.resolve(response);
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
                            $scope.text.published = true;
                            $data.texts.put($scope.id, $scope.text).then(function (result) {
                                $scope.name = result.key;

                                DraftService.clear('texts', $scope.id).then(function (delResponse) {                                    
                                    deferred.resolve(true);
                                }, function (delError) {
                                    deferred.reject(delError);
                                });
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
                    fn.set().then(function () { }, function (setError) {
                        logger.error(setError);
                    });
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