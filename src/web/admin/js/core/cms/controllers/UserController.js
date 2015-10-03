﻿/* global angular:false */

(function () {
    "use strict";

    var UserController = function ($scope, $routeParams, $location, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, AuthService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('UserController');

        $scope.user = undefined;
        $scope.roles = [];

        $scope.editRoles = false;
        
        $scope.enqueue('preloading', function () {
            var deferred = $q.defer();

            var allRoles = [];
            
            for (var roleName in $jsnbt.roles) {
                var role = $jsnbt.roles[roleName];

                var newRole = {};
                $.extend(true, newRole, role);
                newRole.value = newRole.name;
                newRole.disabled = !AuthService.isInRole($scope.current.user, role.name);
                newRole.description = role.inherits.length > 0 ? 'inherits from ' + role.inherits.join(', ') : '';
                
                allRoles.push(newRole);
            };

            $scope.roles = allRoles;

            deferred.resolve(allRoles);

            return deferred.promise;
        });

        $scope.load = function () {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                deferred.resolve();
            }
            else {
                $data.users.get($scope.id).then(function (result) {
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

                $scope.user = $data.create('users', {});

                $scope.setValid(true);
                $scope.setPublished(false);

                deferred.resolve($scope.user);
            }
            else {
                if (data) {
                    $scope.setTitle(data.username);
                    $scope.user = data;

                    $scope.setValid(true);
                    $scope.setPublished(true);

                    deferred.resolve($scope.user);
                }
                else {
                    deferred.reject(new Error('data is not defined for setting into scope'));
                }
            }

            return deferred.promise;
        };

        $scope.enqueue('set', function () {
            var deferred = $q.defer();

            var allowEdit = true;

            if (_.any($scope.roles, function (x) {

                if (!x.disabled && $scope.user.roles.indexOf(x.value) !== -1)
                    if (!AuthService.isInRole($scope.current.user, x.value))
                        return true;

                return false;
            })) {
                allowEdit = false;
            }

            $scope.editRoles = false;
            if ($scope.current.user.id !== $scope.user.id)
                $scope.editRoles = allowEdit;

            deferred.resolve($scope.editRoles);

            return deferred.promise;
        });

        $scope.get = function () {
            return $scope.user;
        };

        $scope.push = function (data) {
            var deferred = $q.defer();

            if ($scope.isNew()) {
                throw new Error('not implemented');
            }
            else {
                $data.users.put($scope.id, data).then(function (result) {
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
    UserController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    angular.module("jsnbt")
        .controller('UserController', ['$scope', '$routeParams', '$location', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'AuthService', 'CONTROL_EVENTS', UserController]);
})();