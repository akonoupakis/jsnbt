/* global angular:false */

(function () {
    "use strict";

    var UserController = function ($scope, $rootScope, $routeParams, $location, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, AuthService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('UserController');

        $scope.localization = false;

        $scope.user = undefined;
        $scope.roles = [];

        $scope.credentials = {
            password: undefined,
            passwordConfirmation: undefined
        };

        $scope.editRoles = false;

        $scope.invalidPasswordComparison = false;
        
        this.enqueue('preloading', function () {
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

        this.enqueue('set', function () {
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

        $scope.validatePasswordConfirm = function (value) {
            var valid = value === $scope.credentials.password;
            $scope.invalidPasswordComparison = !valid;   
            return valid;
        };

        $scope.isNew = function () {
            return self.isNew();
        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    UserController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    UserController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            deferred.resolve();
        }
        else {
            this.ctor.$data.users.get(this.scope.id).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;

    };

    UserController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {
            this.setTitle('');

            this.scope.user = this.ctor.$data.create('users', {});

            this.setValid(true);
            this.setPublished(false);

            deferred.resolve(this.scope.user);
        }
        else {
            if (data) {
                this.setTitle(data.username);
                this.scope.user = data;

                this.setValid(true);
                this.setPublished(true);

                deferred.resolve(this.scope.user);
            }
            else {
                deferred.reject(new Error('data is not defined for setting into scope'));
            }
        }

        return deferred.promise;
    };

    UserController.prototype.get = function () {
        return this.scope.user;
    };

    UserController.prototype.push = function (data) {
        var deferred = this.ctor.$q.defer();

        if (this.isNew()) {

            var newUser = {};
            $.extend(true, newUser, data);

            newUser.password = this.scope.credentials.password;

            this.ctor.$data.users.post(newUser).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }
        else {
            this.ctor.$data.users.put(this.scope.id, data).then(function (result) {
                deferred.resolve(result);
            }).catch(function (error) {
                deferred.reject(error);
            });
        }

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('UserController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'AuthService', 'CONTROL_EVENTS', UserController]);
})();