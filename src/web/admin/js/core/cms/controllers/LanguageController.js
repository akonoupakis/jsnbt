﻿/* global angular:false */

(function () {
    "use strict";

    var LanguageController = function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('LanguageController');

        $scope.data = undefined;
        $scope.options = [];

        $scope.load = function () {            
            var deferred = $q.defer();

            if ($scope.isNew()) {
                deferred.resolve();
            }
            else {
                $data.languages.get($scope.id).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }

            return deferred.promise;

        };

        $scope.set = function (data) {
            var deferred = $q.defer();

            var activeLanguageCodes = _.pluck($scope.application.languages, 'code');

            if ($scope.isNew()) {
                $scope.setTitle('');

                $scope.data = $data.create('languages', {
                    code: '',
                    active: false,
                    default: false,
                });

                $scope.options = _.filter($scope.defaults.languages, function (x) { return activeLanguageCodes.indexOf(x.code) === -1; });

                $scope.setValid(true);
                $scope.setPublished(false);

                deferred.resolve($scope.data);
            }
            else {
                if (data) {
                    $scope.setTitle(data.name);
                    $scope.data = data;

                    activeLanguageCodes = _.filter(activeLanguageCodes, function (x) {
                        return x !== data.code;
                    });

                    $scope.options = _.filter($scope.defaults.languages, function (x) { return activeLanguageCodes.indexOf(x.code) === -1; });

                    $scope.setValid(true);
                    $scope.setPublished(true);

                    deferred.resolve($scope.data);
                }
                else {
                    deferred.reject(new Error('data is not defined for setting into scope'));
                }
            }

            return deferred.promise;
        };

        $scope.enqueue('watch', function () {
            var deferred = $q.defer();

            $scope.$watch('language.code', function (newValue, prevValue) {
                if (newValue !== prevValue && newValue !== undefined) {
                    var language = _.find($scope.defaults.languages, function (x) { return x.code === newValue });
                    if (language)
                        $scope.data.name = language.name;
                }
            });

            deferred.resolve();

            return deferred.promise;
        });

        $scope.get = function () {
            return $scope.data;
        };
        
        $scope.push = function (data) {
            var deferred = $q.defer();
            
            if ($scope.isNew()) {
                $data.languages.post(data).then(function (result) {
                    deferred.resolve(result);
                }).catch(function (error) {
                    deferred.reject(error);
                });
            }
            else {
                $data.languages.put($scope.id, {
                    code: $scope.data.code,
                    name: $scope.data.name,
                    active: $scope.data.active
                }).then(function (result) {
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
    LanguageController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('LanguageController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$q', '$logger', '$data', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', LanguageController]);
})();