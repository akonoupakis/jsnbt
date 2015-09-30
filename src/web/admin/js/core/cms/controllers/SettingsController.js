/* global angular:false */

(function () {
    "use strict";

    var SettingsController = function ($scope, $location, $route, $timeout, $q, $logger, $data, $jsnbt, ScrollSpyService, LocationService, CONTROL_EVENTS) {
        jsnbt.SettingsControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('SettingsController');

        $scope.mySettingsId = undefined;
        $scope.mySettings = {};

        $scope.domains.push('public');

        $scope.injects = [];

        $scope.mailProviders = [];
        $scope.mailTmpl = null;
        $scope.smsProviders = [];
        $scope.smsTmpl = null;

        $scope.enqueue('preloading', function () {
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

        $scope.enqueue('preloading', function () {
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

        $scope.enqueue('preloading', function () {
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

        var setFn = $scope.set;
        $scope.set = function (settings) {
            var deferred = $q.defer();

            setFn(settings).then(function (data) {
                if (data['public']) {
                    $scope.mySettingsId = data['public'].id;
                    $scope.mySettings = data['public'].data;
                }

                deferred.resolve(data);
            });

            return deferred.promise;
        };

        $scope.bindMailTemplate = function (tmpl) {
            if (tmpl && $jsnbt.messaging.mail[tmpl] && $jsnbt.messaging.mail[tmpl].settingsTmpl) {
                $scope.mailTmpl = $jsnbt.messaging.mail[tmpl].settingsTmpl;
            }
            else {
                $scope.mailTmpl = null;
            }
        };

        $scope.bindMailTemplate = function (tmpl) {
            if (tmpl && $jsnbt.messaging.mail[tmpl] && $jsnbt.messaging.mail[tmpl].settingsTmpl) {
                $scope.mailTmpl = $jsnbt.messaging.mail[tmpl].settingsTmpl;
            }
            else {
                $scope.mailTmpl = null;
            }
        };

        $scope.bindSmsTemplate = function (tmpl) {
            if (tmpl && $jsnbt.messaging.sms[tmpl] && $jsnbt.messaging.sms[tmpl].settingsTmpl) {
                $scope.smsTmpl = $jsnbt.messaging.sms[tmpl].settingsTmpl;
            }
            else {
                $scope.smsTmpl = null;
            }
        };

        $scope.enqueue('set', function () {
            var deferred = $q.defer();
            
            if ($scope.messaging && $scope.messaging.mail && $scope.messaging.mail.provider)
                $scope.bindMailTemplate($scope.messaging.mail.provider);
            else
                $scope.bindMailTemplate();

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('set', function () {
            var deferred = $q.defer();

            if ($scope.messaging && $scope.messaging.sms && $scope.messaging.sms.provider)
                $scope.bindSmsTemplate($scope.messaging.sms.provider);
            else
                $scope.bindSmsTemplate();

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('watch', function () {
            var deferred = $q.defer();

            $scope.$watch('settings.messaging.mail.provider', function (newValue, prevValue) {
                if (newValue !== prevValue && newValue !== undefined) 
                    $scope.bindMailTemplate(newValue);
                else 
                    $scope.bindMailTemplate();
                
                deferred.resolve();
            });

            return deferred.promise;
        });

        $scope.enqueue('watch', function () {
            var deferred = $q.defer();

            $scope.$watch('settings.messaging.sms.provider', function (newValue, prevValue) {
                if (newValue !== prevValue && newValue !== undefined)
                    $scope.bindSmsTemplate(newValue);
                else
                    $scope.bindSmsTemplate();

                deferred.resolve();
            });

            return deferred.promise;
        });

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    SettingsController.prototype = Object.create(jsnbt.SettingsControllerBase.prototype);

    angular.module("jsnbt")
        .controller('SettingsController', ['$scope', '$location', '$route', '$timeout', '$q', '$logger', '$data', '$jsnbt', 'ScrollSpyService', 'LocationService', 'CONTROL_EVENTS', SettingsController]);
})(); 