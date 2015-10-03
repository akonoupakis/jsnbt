/* global angular:false */

(function () {
    "use strict";

    var TextController = function ($scope, $routeParams, $location, $timeout, $logger, $q, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('TextController');

        $scope.text = undefined;

        $scope.siblings = [];

        $scope.validation = {
            key: true
        };

        $scope.enqueue('preloading', function () {
            var deferred = $q.defer();

            $scope.languages = $scope.application.localization.enabled ? $scope.application.languages : _.filter($scope.application.languages, function (x) { return x.code === $scope.defaults.language; });
            
            deferred.resolve();

            return deferred.promise;
        });

        $scope.load = function () {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                deferred.resolve();
            }
            else {
                $data.texts.get($scope.id).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        };

        $scope.set = function (data) {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                $scope.setTitle('');

                $scope.text = $data.create('texts', {
                    key: '',
                    group: '',
                    value: {},
                });

                $scope.setValid(true);
                $scope.setPublished(false);

                deferred.resolve($scope.text);
            }
            else {
                if (data) {
                    $scope.setTitle((data.group ? data.group + '.' : '') + data.key);
                    $scope.text = data;

                    $scope.setValid(true);
                    $scope.setPublished(true);

                    deferred.resolve($scope.text);
                }
                else {
                    deferred.reject(new Error('data is not defined for setting into scope'));
                }
            }

            return deferred.promise;
        };

        $scope.get = function () {
            return $scope.text;
        };

        var validateFn = $scope.validate;
        $scope.validate = function () {
            var deferred = $q.defer();

            validateFn().then(function (results) {
                if (results) {
                    $data.texts.get({ id: { $nin: [$scope.id] }, $fields: { group: true, key: true } }).then(function (siblingsResponse) {
                        $scope.siblings = siblingsResponse;

                        var matchedSibling = _.find(siblingsResponse, function (x) { return x.group === $scope.text.group && x.key === $scope.text.key; });

                        if (matchedSibling) {
                            $scope.setValid(false);
                            $scope.validation.key = false;
                        }
                        else {
                            $scope.setValid(true);
                            $scope.validation.key = true;
                        }

                        deferred.resolve($scope.isValid());
                        deferred.resolve(false);
                    }, function (siblingsError) {
                        deferred.reject(siblingsError);
                    });
                }
                else {
                    deferred.resolve(false);
                }

            }).catch(function (ex) {
                deferred.reject(ex);
            });

            return deferred.promise;
        };

        $scope.validateKey = function (value) {
            var valid = true;

            valid = !_.any($scope.siblings, function (x) { return x.group === $scope.text.group && x.key === $scope.text.key; });
            $scope.validation.key = valid;

            return valid;
        };

        $scope.push = function (data) {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                $data.texts.post(data).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }
            else {
                $data.texts.put($scope.id, data).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;
        };
                
        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    TextController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);
    
    angular.module("jsnbt")
        .controller('TextController', ['$scope', '$routeParams', '$location', '$timeout', '$logger', '$q', '$data', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', TextController]);
})();