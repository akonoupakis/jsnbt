/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.SettingsControllerBase = (function (SettingsControllerBase) {

                SettingsControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
                    controllers.FormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

                    var logger = $logger.create('SettingsControllerBase');

                    $scope.localization = false;

                    $scope.settingsId = undefined;
                    $scope.settings = {};
                    $scope.allSettings = {};
                    $scope.savedSettings = {};

                    $scope.domains = [$scope.domain];

                    this.setTitle('settings');
                };
                SettingsControllerBase.prototype = Object.create(controllers.FormControllerBase.prototype);

                SettingsControllerBase.prototype.load = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    this.ctor.$data.settings.get({ domain: { $in: this.scope.domains } }).then(function (results) {
                        var response = {};
                        _.each(self.scope.domains, function (domain) {
                            var domainSettings = _.find(results, function (x) { return x.domain === domain; });
                            if (domainSettings) {
                                response[domain] = domainSettings;
                                self.scope.savedSettings[domain] = true;
                            }
                            else {
                                response[domain] = self.ctor.$data.create('settings', {
                                    domain: domain
                                });
                                self.scope.savedSettings[domain] = false;
                            }
                        });
                        deferred.resolve(response);

                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }

                SettingsControllerBase.prototype.set = function (settings) {
                    var deferred = this.ctor.$q.defer();

                    if (settings && settings[this.scope.domain]) {
                        this.scope.settingsId = settings[this.scope.domain].id;
                        this.scope.settings = settings[this.scope.domain].data;
                    }

                    this.scope.allSettings = settings;

                    this.setValid(true);
                    this.setPublished(true);

                    deferred.resolve(this.scope.allSettings);

                    return deferred.promise;
                };

                SettingsControllerBase.prototype.get = function () {
                    var self = this;

                    var result = {};
                    
                    _.each(self.scope.domains, function (domain) {
                        if (self.scope.allSettings[domain])
                            result[domain] = self.scope.allSettings[domain];
                    });

                    return result;
                };

                SettingsControllerBase.prototype.getBreadcrumb = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    controllers.ControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {
                        
                        deferred.resolve(breadcrumb);

                    }).catch(function (ex) {
                        deferred.reject(ex);
                    });

                    return deferred.promise;
                };

                SettingsControllerBase.prototype.push = function (data) {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    var settingKeys = _.keys(self.scope.allSettings);
                    var promises = _.map(settingKeys, function (domain) {
                        var setting = self.scope.allSettings[domain];
                        if (self.scope.savedSettings[domain]) {
                            return self.ctor.$data.settings.put(setting.id, {
                                data: setting.data
                            });
                        }
                        else {
                            return self.ctor.$data.settings.post({
                                domain: setting.domain,
                                data: setting.data
                            });
                        }
                    });

                    self.ctor.$q.all(promises).then(function (results) {

                        for (var domain in self.scope.allSettings) {
                            var setting = _.find(results, function (x) {
                                return x.domain === domain;
                            });
                            self.scope.allSettings[domain] = setting;
                            self.scope.savedSettings[domain] = true;
                        }

                        deferred.resolve(self.scope.allSettings);
                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                return SettingsControllerBase;

            })(controllers.SettingsControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();