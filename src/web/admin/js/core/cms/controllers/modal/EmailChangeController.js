;(function () {
    "use strict";

    var EmailChangeController = function ($scope, $rootScope, $logger, AuthService, MODAL_EVENTS) {
        jsnbt.controllers.FormModalControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('EmailChangeController');
        
        $scope.invalidCode = false;

        $scope.requesting = false;
        $scope.requested = false;
        $scope.submitted = false;

        $scope.requestCode = function () {
            $scope.requesting = true;
            AuthService.requestEmailChangeCode($scope.model.email).then(function (code) {
                $scope.requesting = false;
                $scope.requested = true;

                $scope.btn.cancel = false;
                $scope.btn.ok = 'submit';
            }).catch(function (ex) {
                $scope.requesting = false;
                throw ex;
            });
        };
        
        this.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    EmailChangeController.prototype = Object.create(jsnbt.controllers.FormModalControllerBase.prototype);

    EmailChangeController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();
        
        deferred.resolve({
            email: undefined,
            code: undefined
        });
        
        return deferred.promise;

    };

    EmailChangeController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        this.scope.model = data;

        this.setValid(true);

        deferred.resolve(this.scope.model);
        
        return deferred.promise;
    };

    EmailChangeController.prototype.push = function (data) {
        var self = this;

        var deferred = this.ctor.$q.defer();

        self.scope.invalidCode = false;

        this.ctor.AuthService.submitEmailChangeCode(data.email, data.code).then(function (response) {
            if (response) {
                self.scope.invalidCode = false;
                deferred.resolve(true);
            }
            else {
                self.scope.invalidCode = true;
                deferred.resolve(false);
            }
        }).catch(function (ex) {
            self.scope.invalidCode = true;
            deferred.resolve(false);
        });

        return deferred.promise;
    };

    EmailChangeController.prototype.failed = function (ex) {
        
    };

    EmailChangeController.prototype.get = function () {
        return this.scope.model;
    };

    angular.module("jsnbt")
        .controller('EmailChangeController', ['$scope', '$rootScope', '$logger', 'AuthService', 'MODAL_EVENTS', EmailChangeController]);
})();