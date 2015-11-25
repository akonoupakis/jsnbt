/* global angular:false */

(function () {
    "use strict";

    var TextController = function ($scope, $rootScope, $routeParams, $location, $timeout, $logger, $q, $data, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('TextController');

        $scope.localization = false;

        $scope.text = undefined;

        $scope.siblings = [];

        $scope.validation.key = true;

        this.enqueue('preloading', '', function () {
            var deferred = $q.defer();

            $scope.languages = $scope.application.localization.enabled ? $scope.application.languages : [$scope.defaults.languages[$scope.defaults.language]];
            
            deferred.resolve();

            return deferred.promise;
        });

        $scope.validateKey = function (value) {
            var valid = true;

            valid = !_.any($scope.siblings, function (x) { return x.group === $scope.text.group && x.key === $scope.text.key; });
            $scope.validation.key = valid;

            return valid;
        };
                        
        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    TextController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    TextController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            deferred.resolve();
        }
        else {
            this.ctor.$data.texts.get(this.scope.id).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    TextController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            this.setTitle('');

            this.scope.text = this.ctor.$data.create('texts', {
                key: '',
                group: '',
                value: {},
            });

            this.setValid(true);
            this.setPublished(false);

            deferred.resolve(this.scope.text);
        }
        else {
            if (data) {
                this.setTitle((data.group ? data.group + '.' : '') + data.key);
                this.scope.text = data;

                this.setValid(true);
                this.setPublished(true);

                deferred.resolve(this.scope.text);
            }
            else {
                deferred.reject(new Error('data is not defined for setting into scope'));
            }
        }

        return deferred.promise;
    };

    TextController.prototype.get = function () {
        return this.scope.text;
    };

    TextController.prototype.validate = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        jsnbt.controllers.FormControllerBase.prototype.validate.apply(this, arguments).then(function (results) {
            if (results) {
                self.ctor.$data.texts.get({ id: { $nin: [self.scope.id] }, $fields: { group: true, key: true } }).then(function (siblingsResponse) {
                    self.scope.siblings = siblingsResponse;

                    var matchedSibling = _.find(siblingsResponse, function (x) { return x.group === self.scope.text.group && x.key === self.scope.text.key; });

                    if (matchedSibling) {
                        self.setValid(false);
                        self.scope.validation.key = false;
                    }
                    else {
                        self.setValid(true);
                        self.scope.validation.key = true;
                    }

                    deferred.resolve(self.isValid());
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

    TextController.prototype.push = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            this.ctor.$data.texts.post(data).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }
        else {
            this.ctor.$data.texts.put(this.scope.id, data).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };
    
    angular.module("jsnbt")
        .controller('TextController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$logger', '$q', '$data', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', TextController]);
})();