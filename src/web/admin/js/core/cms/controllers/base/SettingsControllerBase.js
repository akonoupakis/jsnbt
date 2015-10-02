/* global angular:false */

(function () {
    "use strict";

    jsnbt.SettingsControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.FormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('SettingsControllerBase');

        $scope.settingsId = undefined;
        $scope.settings = {};
        $scope.allSettings = {};
        $scope.savedSettings = {};

        $scope.domains = [$scope.domain];
        
        $scope.setTitle('settings');

        $scope.load = function () {
            var deferred = $q.defer();

            $data.settings.get({ domain: { $in: $scope.domains } }).then(function (results) {
                var response = {};
                _.each($scope.domains, function (domain) {
                    var domainSettings = _.find(results, function (x) { return x.domain === domain; });
                    if (domainSettings) {
                        response[domain] = domainSettings;
                        $scope.savedSettings[domain] = true;
                    }
                    else {
                        response[domain] = $data.create('settings', {
                            domain: domain
                        });
                        $scope.savedSettings[domain] = false;
                    }
                });
                deferred.resolve(response);

            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        }

        $scope.set = function (settings) {
            var deferred = $q.defer();

            if (settings && settings[$scope.domain]) {
                $scope.settingsId = settings[$scope.domain].id;
                $scope.settings = settings[$scope.domain].data;
            }

            $scope.allSettings = settings;

            $scope.setValid(true);
            $scope.setPublished(true);

            deferred.resolve($scope.allSettings);

            return deferred.promise;
        };

        $scope.get = function () {
            var result = {};

            _.each($scope.domains, function (domain) {
                if ($scope.allSettings[domain])
                    result[domain] = $scope.allSettings[domain];
            });

            return result;
        };

        $scope.push = function (data) {
            var deferred = $q.defer();

            var settingKeys = _.keys($scope.allSettings);
            var promises = _.map(settingKeys, function (domain) {
                var setting = $scope.allSettings[domain];
                if ($scope.savedSettings[domain]) {
                    return $data.settings.put(setting.id, {
                        data: setting.data
                    });
                }
                else {
                    return $data.settings.post({
                        domain: setting.domain,
                        data: setting.data
                    });
                }
            });

            $q.all(promises).then(function (results) {
                
                for (var domain in $scope.allSettings) {
                    var setting = _.find(results, function (x) {
                        return x.domain === domain;
                    });
                    $scope.allSettings[domain] = setting;
                    $scope.savedSettings[domain] = true;
                }

                deferred.resolve($scope.allSettings);
            }).catch(function (error) {
                deferred.reject(error);
            });

            return deferred.promise;
        };
    };
    jsnbt.SettingsControllerBase.prototype = Object.create(jsnbt.FormControllerBase.prototype);

})();