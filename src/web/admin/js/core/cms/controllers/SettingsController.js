/* global angular:false */

(function () {
    "use strict";

    var SettingsController = function ($scope, $rootScope, $location, $route, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.controllers.SettingsControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('SettingsController');

        $scope.mySettingsId = undefined;
        $scope.mySettings = {};

        $scope.domains.push('public');

        $scope.injects = [];

        $scope.mailProviders = [];
        $scope.mailTmpl = null;
        $scope.smsProviders = [];
        $scope.smsTmpl = null;

        this.enqueue('preloading', '', function () {
            var deferred = $q.defer();

            var injects = [];
            _.each($jsnbt.injects, function (inject) {
                if (inject.settings)
                    injects.push(inject.settings);
            });
            $scope.injects = injects;

            deferred.resolve(injects);

            return deferred.promise;
        });

        this.enqueue('preloading', '', function () {
            var deferred = $q.defer();

            var providers = [];

            for (var providerDomain in $jsnbt.messaging.mail) {
                var provider = $jsnbt.messaging.mail[providerDomain];
                providers.push({ value: providerDomain, name: provider.name, tmpl: provider.settingsTmpl });
            }

            $scope.mailProviders = providers;

            deferred.resolve(providers);

            return deferred.promise;
        });

        this.enqueue('preloading', '', function () {
            var deferred = $q.defer();

            var providers = [];

            for (var providerDomain in $jsnbt.messaging.sms) {
                var provider = $jsnbt.messaging.sms[providerDomain];
                providers.push({ value: providerDomain, name: provider.name, tmpl: provider.settingsTmpl });
            }

            $scope.smsProviders = providers;

            deferred.resolve(providers);

            return deferred.promise;
        });
     
        this.enqueue('set', '', function () {
            var deferred = $q.defer();
            
            if ($scope.messaging && $scope.messaging.mail && $scope.messaging.mail.provider)
                self.setMailTemplate($scope.messaging.mail.provider);
            else
                self.setMailTemplate();

            deferred.resolve();

            return deferred.promise;
        });

        this.enqueue('set', '', function () {
            var deferred = $q.defer();

            if ($scope.messaging && $scope.messaging.sms && $scope.messaging.sms.provider)
                self.setSmsTemplate($scope.messaging.sms.provider);
            else
                self.setSmsTemplate();

            deferred.resolve();

            return deferred.promise;
        });

        this.enqueue('watch', '', function () {
            var deferred = $q.defer();

            $scope.$watch('settings.messaging.mail.provider', function (newValue, prevValue) {
                if (newValue !== prevValue && newValue !== undefined) 
                    self.setMailTemplate(newValue);
                else 
                    self.setMailTemplate();
                
                deferred.resolve();
            });

            return deferred.promise;
        });

        this.enqueue('watch', '', function () {
            var deferred = $q.defer();

            $scope.$watch('settings.messaging.sms.provider', function (newValue, prevValue) {
                if (newValue !== prevValue && newValue !== undefined)
                    self.setSmsTemplate(newValue);
                else
                    self.setSmsTemplate();

                deferred.resolve();
            });

            return deferred.promise;
        });

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    SettingsController.prototype = Object.create(jsnbt.controllers.SettingsControllerBase.prototype);

    SettingsController.prototype.set = function (settings) {
        var deferred = this.ctor.$q.defer();

        var self = this;

        jsnbt.controllers.SettingsControllerBase.prototype.set.apply(this, arguments).then(function (data) {
            if (data['public']) {
                self.scope.mySettingsId = data['public'].id;
                self.scope.mySettings = data['public'].data;
            }

            deferred.resolve(data);
        });

        return deferred.promise;
    };

    SettingsController.prototype.setMailTemplate = function (tmpl) {
        if (tmpl && this.ctor.$jsnbt.messaging.mail[tmpl] && this.ctor.$jsnbt.messaging.mail[tmpl].settingsTmpl) {
            this.scope.mailTmpl = this.ctor.$jsnbt.messaging.mail[tmpl].settingsTmpl;
        }
        else {
            this.scope.mailTmpl = null;
        }
    };

    SettingsController.prototype.setSmsTemplate = function (tmpl) {
        if (tmpl && this.ctor.$jsnbt.messaging.sms[tmpl] && this.ctor.$jsnbt.messaging.sms[tmpl].settingsTmpl) {
            this.scope.smsTmpl = this.ctor.$jsnbt.messaging.sms[tmpl].settingsTmpl;
        }
        else {
            this.scope.smsTmpl = null;
        }
    };

    angular.module("jsnbt")
        .controller('SettingsController', ['$scope', '$rootScope', '$location', '$route', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', SettingsController]);
})(); 