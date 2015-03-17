/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('TestItemController', function ($scope, $controller, $rootScope, $routeParams, $location, $timeout, $logger, $queue, $q, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
           
            var logger = $logger.create('TestItemController');

            $controller('FormBaseController', {
                $scope: $scope,
                $routeParams: $routeParams,
                LocationService: LocationService,
                ScrollSpyService: ScrollSpyService,
                CONTROL_EVENTS: CONTROL_EVENTS
            });
   
            var fn = {

                set: function () {
                    var deferred = $q.defer();

                    $scope.languages = $scope.application.localization.enabled ? $scope.application.languages : _.filter($scope.application.languages, function (x) { return x.code === 'en'; });

                    if ($scope.isNew()) {
                        
                        $scope.set($data.create('texts', {
                            key: '',
                            group: '',
                            value: {},
                        }));
                        
                        $scope.setName('');

                        $scope.setValid(true);

                        $scope.setPublished(false);

                        deferred.resolve();

                    }
                    else {
                        $data.texts.get($routeParams.id).then(function (result) {

                            $scope.set(result);

                            $scope.setName(result.key);

                            $scope.setValid(true);

                            $scope.setPublished(true);

                            deferred.resolve();

                        }, function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                },
  
                validate: function () {
                    var deferred = $q.defer();
                    
                    $scope.validate();

                    deferred.resolve($scope.isValid());
                    
                    return deferred.promise;
                },

                publish: function () {
                    var deferred = $q.defer();

                    this.validate().then(function (validationResults) {
                        if (!validationResults) {
                            deferred.resolve(false);
                        }
                        else {
                            if ($scope.isNew()) {
                                $data.texts.post($scope.get()).then(function (result) {
                                    deferred.resolve(true, result.id);
                                }, function (error) {
                                    deferred.reject(error);
                                });
                            }
                            else {
                                $data.texts.put($scope.id, $scope.get()).then(function (result) {
                                    $scope.setName(result.key);
                                    deferred.resolve(true, result.id);
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
                $location.previous('/content/test');
            };

            $scope.discard = function () {
                fn.set().catch(function (ex) {
                    logger.error(ex);
                });
            };

            $scope.publish = function () {
                fn.publish().then(function (success, itemId) {
                    $scope.setPublished(success);

                    if (!success) {
                        $scope.scroll2error();
                    }
                    else {
                        if ($scope.isNew()) {
                            $location.goto('/content/texts/' + itemId);
                        }
                    }
                }, function (ex) {
                    logger.error(ex);
                });
            };
            
            $timeout(function () {
                fn.set().then(function () {
                    $scope.setSpy(200);
                }, function (ex) {
                    logger.error(ex);
                });
            }, 200);
                      
        });
})();