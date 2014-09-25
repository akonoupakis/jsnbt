/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', function ($scope, $rootScope, $route, $location, $logger, $q, $data, LocationService, AuthService, AUTH_EVENTS) {

            var logger = $logger.create('AppController');

            $scope.application = {};
            $scope.current = {};
            $scope.defaults = {};
          
            $scope.current.user = undefined;
            $scope.current.restoreFn = undefined;
            $scope.current.breadcrumb = [];

            $scope.application.version = jsnbt.version;
            $scope.application.languages = [];

            $scope.defaults.languages = [];
            $scope.defaults.language = null;


            var apply = function (fn) {
                var phase = $scope.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof (fn) === 'function')) {
                        fn();
                    }
                } else {
                    $scope.$apply(fn);
                }
            };


            var fn = {

                setDefaultLanguages: function () {
                    var deferred = $q.defer();

                    var results = jsnbt.languages;

                    $scope.defaults.languages = results;

                    deferred.resolve(results);

                    return deferred.promise;
                },

                setApplicationLanguages: function () {
                    var deferred = $q.defer();

                    $data.languages.get({ active: true }).then(function (results) {

                        var languages = _.sortBy(_.filter(results, function (x) { return x.active === true; }), 'name');

                        $scope.application.languages = languages;

                        deferred.resolve(languages);

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                },

                setDefaultLanguage: function () {
                    var deferred = $q.defer();

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

                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred.promise;
                }

            };


            $scope.current.setBreadcrumb = function (value) {
                $scope.current.breadcrumb = value;
            };

            $scope.current.setUser = function (value) {
                $scope.current.user = !!value ? value : undefined;
            };

            $scope.current.login = function (username, password) {
                AuthService.login(username, password).then(function (user) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                }, function (error) {
                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                });
            };

            $scope.current.logout = function () {
                AuthService.logout().then(function () {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                        $route.reload();
                    });                    
                });
            };


            dpd.on('languageCreated', function (language) {
                fn.setApplicationLanguages().then(function () {
                    if (language.default)
                        $scope.defaults.language = language.code;
                });
            });

            dpd.on('languageDeleted', function (language) {
                fn.setApplicationLanguages();
            });
            
            $rootScope.$on('$routeChangeSuccess', function () {
                $scope.current.setBreadcrumb(LocationService.getBreadcrumb());
            });

            $scope.$on(AUTH_EVENTS.authenticated, function (sender, user) {
                apply(function () {
                    $scope.current.setUser(user);
                });
            });

            $scope.$on(AUTH_EVENTS.notAuthenticated, function (sender, fn) {
                apply(function () {
                    $scope.current.setUser(null);
                    $scope.current.restoreFn = fn;
                });
            });

            $scope.$on(AUTH_EVENTS.loginSuccess, function (sender, user) {
                apply(function () {
                    $scope.current.setUser(user);
                    if (typeof ($scope.current.restoreFn) === 'function') {
                        $scope.current.restoreFn();
                    }
                });
            });

            
            fn.setDefaultLanguages().then(function () {
                fn.setApplicationLanguages().then(function () {
                    fn.setDefaultLanguage().then(function () { }, function (dlError) {
                        logger.error(dlError);
                    });
                }, function (alsError) {
                    logger.error(alsError);
                });
            }, function (dlsError) {
                logger.error(dlsError);
            });

        });
})();