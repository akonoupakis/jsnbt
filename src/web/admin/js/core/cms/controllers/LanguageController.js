/* global angular:false */

(function () {
    "use strict";

    var LanguageController = function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('LanguageController');

        $scope.localization = false;

        $scope.data = undefined;
        $scope.options = [];

        this.enqueue('watch', function () {
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
       
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    LanguageController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    LanguageController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            deferred.resolve();
        }
        else {
            this.ctor.$data.languages.get(this.scope.id).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;

    };

    LanguageController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        var activeLanguageCodes = _.pluck(this.scope.application.languages, 'code');

        if (this.isNew()) {
            this.setTitle('');

            this.scope.data = this.ctor.$data.create('languages', {
                code: '',
                active: false,
                default: false,
            });

            this.scope.options = _.filter(this.scope.defaults.languages, function (x) { return activeLanguageCodes.indexOf(x.code) === -1; });

            this.setValid(true);
            this.setPublished(false);

            deferred.resolve($scope.data);
        }
        else {
            if (data) {
                this.setTitle(data.name);
                this.scope.data = data;

                activeLanguageCodes = _.filter(activeLanguageCodes, function (x) {
                    return x !== data.code;
                });

                this.scope.options = _.filter(this.scope.defaults.languages, function (x) { return activeLanguageCodes.indexOf(x.code) === -1; });

                this.setValid(true);
                this.setPublished(true);

                deferred.resolve(this.scope.data);
            }
            else {
                deferred.reject(new Error('data is not defined for setting into scope'));
            }
        }

        return deferred.promise;
    };

    LanguageController.prototype.get = function () {
        return this.scope.data;
    };

    LanguageController.prototype.push = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            this.ctor.$data.languages.post(data).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }
        else {
            this.ctor.$data.languages.put(this.scope.id, {
                code: this.scope.data.code,
                name: this.scope.data.name,
                active: this.scope.data.active
            }).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('LanguageController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$q', '$logger', '$data', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', LanguageController]);
})();