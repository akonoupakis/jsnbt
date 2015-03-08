/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TextController', function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $queue, $q, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
           
            var logger = $logger.create('TextController');

            $scope.id = $routeParams.id;
            $scope.new = $scope.id === 'new';
            $scope.name = undefined;
            $scope.text = undefined;

            $scope.siblingKeys = [];
            $scope.languages = [];

            $scope.valid = true;
            $scope.validation = {
                key: true
            };

            $scope.published = true;
            $scope.draft = false;


            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $scope.languages = $scope.application.localization.enabled ? $scope.application.languages : _.filter($scope.application.languages, function (x) { return x.code === 'en'; });

                    if ($scope.new) {
                        $scope.name = '';

                        $scope.text = $data.create('texts', {
                            key: '',
                            group: '',
                            value: {},
                        });
                        
                        $scope.valid = true;

                        $scope.published = false;
                        $scope.draft = true;

                        deferred.resolve();
                    }
                    else {
                        $data.texts.get($scope.id).then(function (result) {

                            $scope.name = result.key;
                            $scope.text = result;

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
                    $scope.validation.key = true;

                    $scope.$broadcast(CONTROL_EVENTS.initiateValidation);

                    if ($scope.valid) {

                        $data.texts.get({ id: { $nin: [$scope.id] }, $fields: { group: true, key: true } }).then(function (siblingsResponse) {

                            $scope.siblings = siblingsResponse;

                            var matchedSibling = _.find(siblingsResponse, function (x) { return x.group === $scope.text.group && x.key === $scope.text.key; });

                            if (matchedSibling) {
                                $scope.valid = false;
                                $scope.validation.key = false;
                            }
                            else {
                                $scope.valid = true;
                                $scope.validation.key = true;
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
                            if ($scope.new) {
                                $data.texts.post($scope.text).then(function (result) {
                                    $scope.id = result.id;
                                    deferred.resolve(true);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.texts.put($scope.id, $scope.text).then(function (result) {
                                    $scope.name = result.key;
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

            $scope.validateKey = function (value) {
                var valid = true;

                valid = _.find($scope.siblings, function (x) { return x.group === $scope.text.group && x.key === $scope.text.key; }) === undefined;
                $scope.validation.key = valid;

                return valid;
            };


            $scope.back = function () {
                $location.previous('/content/texts');
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
                            $location.goto('/content/texts/' + $scope.id);
                        }
                    }
                }, function (ex) {
                    logger.error(ex);
                });
            };

            $scope.$watch('name', function (newValue, prevValue) {
                fn.setLocation().catch(function (ex) {
                    logger.error(ex);
                });
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
                      
        });
})();