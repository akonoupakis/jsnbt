/* global angular:false */

(function () {
    "use strict";

    var AccountController = function ($scope, $rootScope, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, AuthService, FileService,ModalService, CONTROL_EVENTS) {
        jsnbt.controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('AccountController');

        $scope.localization = false;
        
        $scope.changeEmail = function () {
            ModalService.form(function (x) {
                x.title('change email');
                x.controller('EmailChangeController');
                x.template('tmpl/core/modals/emailEditor.html');
                x.scope({
                    btn: {
                        cancel: 'cancel',
                        ok: false 
                    }
                });
            }).then(function (response) {
                $scope.model.username = response;
                $scope.current.user.username = response;
            }).catch(function (error) {
                logger.error(error);
            });
        };

        $scope.changePassword = function () {
            ModalService.form(function (x) {
                x.title('change password');
                x.controller('PasswordChangeController');
                x.template('tmpl/core/modals/passwordEditor.html');
            }).then(function () {
                
            }).catch(function (error) {
                logger.error(error);
            });
        };

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    AccountController.prototype = Object.create(jsnbt.controllers.FormControllerBase.prototype);

    AccountController.prototype.load = function () {
        var deferred = this.ctor.$q.defer();

        this.ctor.$data.users.get(this.scope.current.user.id).then(function (result) {
            deferred.resolve(result);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;

    };

    AccountController.prototype.set = function (data) {
        var deferred = this.ctor.$q.defer();

        this.setTitle('my account');
        this.scope.model = data;

        this.setValid(true);
        this.setPublished(true);

        deferred.resolve(this.scope.model);

        return deferred.promise;
    };

    AccountController.prototype.get = function () {
        return this.scope.model;
    };

    AccountController.prototype.push = function (data) {
        var self = this;

        var deferred = this.ctor.$q.defer();

        this.ctor.$data.users.put(this.scope.current.user.id, data).then(function (result) {
            self.scope.current.setUser(data);
            deferred.resolve(data);
        }).catch(function (error) {
            deferred.reject(error);
        });

        return deferred.promise;
    };

    angular.module("jsnbt")
        .controller('AccountController', ['$scope', '$rootScope', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'AuthService', 'ModalService', 'CONTROL_EVENTS', AccountController]);
})();