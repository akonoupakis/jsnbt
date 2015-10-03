/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.Controller = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

                var logger = $logger.create('Controller');

                $scope.root = true;

                $scope.application = {

                    version: $jsnbt.version,
                    languages: [],
                    localization: $jsnbt.localization,
                    ssl: $jsnbt.ssl,
                    navigationSpec: []

                };

                $scope.current = {

                    user: undefined,
                    breadcrumb: {
                        title: 'you are here: ',
                        items: []
                    },
                    modules: $jsnbt.modules

                };

                $scope.defaults = {

                    countries: $jsnbt.countries,

                    languages: [],
                    language: null

                };

                var navigationInjects = [];
                _.each($jsnbt.injects, function (inject) {
                    if (_.isArray(inject.navigation)) {
                        _.each(inject.navigation, function (iNav) {
                            navigationInjects.push(iNav);
                        });
                    }
                });

                $scope.application.navigationSpec = navigationInjects;

                $scope.current.getBreadcrumb = function () {
                    return $scope.current.breadcrumb.items;
                };

                $scope.current.setBreadcrumb = function (value) {
                    $scope.current.breadcrumb.items = value;
                };

                $scope.setDefaultLanguages = function () {
                    var deferred = $q.defer();

                    var results = $jsnbt.languages;

                    $scope.defaults.languages = results;

                    deferred.resolve(results);

                    return deferred.promise;
                };

                $scope.setApplicationLanguages = function () {
                    var deferred = $q.defer();

                    $data.languages.get().then(function (results) {

                        var languages = _.sortBy(results, 'name');

                        $scope.application.languages = languages;

                        deferred.resolve(languages);

                    }).catch(function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                };

                $scope.setDefaultLanguage = function () {
                    var deferred = $q.defer();

                    if (!$jsnbt.localization.enabled) {
                        $scope.defaults.language = $jsnbt.localization.locale;
                        deferred.resolve($scope.defaults.language);
                    }
                    else {
                        $data.languages.get({ active: true, 'default': true, $limit: 1 }).then(function (results) {
                            var defaultLanguage = _.first(results);
                            var defaultLangCode = defaultLanguage ? defaultLanguage.code : '';
                            if (_.filter($scope.application.languages, function (x) { return x.code === defaultLangCode; }).length === 0) {
                                var firstLanguage = _.first($scope.application.languages);
                                if (firstLanguage) {
                                    defaultLangCode = firstLanguage.code;
                                }
                            }

                            $scope.defaults.language = defaultLangCode;

                            deferred.resolve(defaultLangCode);

                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }

                    return deferred.promise;
                };


                $scope.current.setUser = function (value) {
                    $scope.current.user = !!value ? value : undefined;
                };

                jsnbt.db.on(DATA_EVENTS.userUpdated, function (user) {
                    if ($scope.current.user)
                        if (user.id === $scope.current.user.id)
                            $scope.current.setUser(user);
                });

                jsnbt.db.on(DATA_EVENTS.languageCreated, function (language) {
                    $scope.setApplicationLanguages().then(function () {
                        if (language.default)
                            $scope.defaults.language = language.code;
                    });
                });

                jsnbt.db.on(DATA_EVENTS.languageUpdated, function (language) {
                    var matched = _.find($scope.application.languages, function (x) { return x.id === language.id; });
                    matched.code = language.code;
                    matched.name = language.name;
                    matched.active = language.active;
                    if (language.default) {
                        _.each($scope.application.languages, function (lang) {
                            if (lang.id !== language.id)
                                lang.default = false;
                        });

                        matched.default = true;
                    }
                });

                jsnbt.db.on(DATA_EVENTS.languageDeleted, function (language) {
                    $scope.setApplicationLanguages();
                });


                var initiated = false;
                $scope.init = function () {
                    var deferred = $q.defer();

                    if (!initiated) {
                        $scope.setDefaultLanguages().then(function () {
                            $scope.setApplicationLanguages().then(function () {
                                $scope.setDefaultLanguage().then(function () {
                                    initiated = true;
                                    deferred.resolve();
                                }, function (dlError) {
                                    deferred.reject(dlError);
                                });
                            }, function (alsError) {
                                deferred.reject(alsError);
                            });
                        }, function (dlsError) {
                            deferred.reject(dlsError);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                }
            };

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();