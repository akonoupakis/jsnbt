;(function () {
    "use strict";

    var PasswordChangeController = function ($scope, $rootScope, $logger, AuthService, MODAL_EVENTS) {
        jsnbt.controllers.FormModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('PasswordChangeController');
        
        $scope.invalidPassword = false;
        $scope.invalidPasswordComparison = false;
        
        $scope.validatePasswordConfirm = function (value) {
            var valid = value === $scope.model.newPassword;
            $scope.invalidPasswordComparison = !valid;
            return valid;
        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    PasswordChangeController.prototype = Object.create(jsnbt.controllers.FormModalControllerBase.prototype);

    PasswordChangeController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();
        
        deferred.resolve({
            password: undefined,
            newPassword: undefined,
            newPasswordConfirmation: undefined
        });
        
        return deferred.promise;

    };

    PasswordChangeController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        this.scope.model = data;

        this.setValid(true);

        deferred.resolve(this.scope.model);
        
        return deferred.promise;
    };

    PasswordChangeController.prototype.publish = function (data) {
        var self = this;

        var deferred = this.ctor.$q.defer();

        self.scope.invalidPassword = false;

        this.ctor.AuthService.setPassword(data.password, data.newPassword).then(function (response) {
            if (response) {
                deferred.resolve(true);
            }
            else {
                self.scope.invalidPassword = true;
                deferred.resolve(false);
            }
        }).catch(function (ex) {
            self.scope.invalidPassword = true;
            deferred.resolve(false);
        });

        return deferred.promise;
    };

    PasswordChangeController.prototype.failed = function (ex) {
        
    };

    PasswordChangeController.prototype.get = function () {
        return this.scope.model;
    };

    angular.module("jsnbt")
        .controller('PasswordChangeController', ['$scope', '$rootScope', '$logger', 'AuthService', 'MODAL_EVENTS', PasswordChangeController]);
})();