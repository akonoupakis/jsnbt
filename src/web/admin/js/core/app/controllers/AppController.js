/* global angular:false */

(function () {
    "use strict";

    angular.module("jsnbt")
        .controller('AppController', ['$scope', '$controller', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS',
            function ($scope, $controller, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

            var logger = $logger.create('AppController');

            $scope.application = {};
            $scope.current = {};
            $scope.defaults = {};
          
            $scope.current.user = undefined;
            $scope.current.users = true;
            $scope.current.denied = false;
            $scope.current.initiated = false;
            $scope.current.restoreFn = undefined;
            $scope.current.breadcrumb = [];
            $scope.current.modules = $jsnbt.modules;

            $scope.application.version = $jsnbt.version;
            $scope.application.languages = [];
            $scope.application.localization = $jsnbt.localization;
            $scope.application.ssl = $jsnbt.ssl;
            
            $scope.defaults.countries = $jsnbt.countries;

            $scope.defaults.languages = [];
            $scope.defaults.language = null;

            var navigationInjects = [];
            _.each($jsnbt.injects, function (inject) {
                if (_.isArray(inject.navigation)) {
                    _.each(inject.navigation, function (iNav) {
                        navigationInjects.push(iNav);
                    });
                }
            });

            $scope.application.navigationSpec = navigationInjects;

            $scope.base = {
                $scope: $scope,
                $controller: $controller,
                $route: $route,
                $rootScope: $rootScope,
                $routeParams: $routeParams,
                $location: $location,
                $data: $data,
                $q: $q,
                $timeout: $timeout,
                $jsnbt: $jsnbt,
                $fn: $fn,
                AuthService: AuthService,
                TreeNodeService: TreeNodeService,
                LocationService: LocationService,
                ScrollSpyService: ScrollSpyService,
                ModalService: ModalService,
                DATA_EVENTS: DATA_EVENTS,
                CONTROL_EVENTS: CONTROL_EVENTS
            };

            //$scope.base.list = {
            //    $scope: $scope
            //};

            //$scope.base.form = {
            //    $scope: $scope,
            //    $routeParams: $routeParams,
            //    LocationService: LocationService,
            //    ScrollSpyService: ScrollSpyService,
            //    CONTROL_EVENTS: CONTROL_EVENTS
            //};

            //$scope.base.settings = {
            //    $scope: $scope,
            //    $route: $route,
            //    $routeParams: $routeParams,
            //    $q: $q,
            //    $timeout: $timeout,
            //    $data: $data,
            //    LocationService: LocationService,
            //    ScrollSpyService: ScrollSpyService,
            //    CONTROL_EVENTS: CONTROL_EVENTS
            //};

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

                    var results = $jsnbt.languages;

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

                        }, function (error) {
                            deferred.reject(error);
                        });
                    }

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
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);                    
                });
            };

            $scope.goto = function (path) {
                $location.goto(path);
            };

            $scope.isAuthorized = function (section) {
                return AuthService.authorize($scope.current.user, section);
            };

            $scope.scroll2error = function () {
                setTimeout(function () {
                    var firstInvalidControl = $('.ctrl.invalid:visible:first');
                    if (firstInvalidControl.length > 0)
                        if (!firstInvalidControl.inViewport())
                            $('body').scrollTo(firstInvalidControl, { offset: -150, duration: 400 });
                }, 100);
            };

            jsnbt.db.on(DATA_EVENTS.userUpdated, function (user) {
                if ($scope.current.user)
                    if (user.id === $scope.current.user.id)
                        $scope.current.setUser(user);
            });

            jsnbt.db.on(DATA_EVENTS.languageCreated, function (language) {
                fn.setApplicationLanguages().then(function () {
                    if (language.default)
                        $scope.defaults.language = language.code;
                });
            });

            jsnbt.db.on(DATA_EVENTS.languageDeleted, function (language) {
                fn.setApplicationLanguages();
            });
            
            $rootScope.$on('$routeChangeSuccess', function () {
                $scope.current.setBreadcrumb(LocationService.getBreadcrumb());
            });

            $scope.$on(ROUTE_EVENTS.routeStarted, function (sender) {
                apply(function () {
                    $scope.current.initiated = false;
                });
            });

            $scope.$on(ROUTE_EVENTS.routeCompleted, function (sender) {
                apply(function () {
                    $scope.current.initiated = true;
                });
            });

            $scope.$on(AUTH_EVENTS.noUsers, function (sender, fn) {
                apply(function () {
                    $scope.current.users = false;
                });
            });

            $scope.$on(AUTH_EVENTS.userCreated, function (sender, fn) {
                apply(function () {
                    $scope.current.users = true;
                });
            });

            $scope.$on(AUTH_EVENTS.authenticated, function (sender, user) {
                apply(function () {
                    $scope.current.denied = false;
                    $scope.current.setUser(user);
                });
            });

            $scope.$on(AUTH_EVENTS.notAuthenticated, function (sender, fn) {
                apply(function () {
                    $scope.current.denied = false;
                    $scope.current.setUser(null);
                    $scope.current.restoreFn = fn;
                });
            });

            $scope.$on(AUTH_EVENTS.accessDenied, function (sender) {
                apply(function () {
                    $scope.current.denied = true;
                });
            });

            $scope.$on(AUTH_EVENTS.loginSuccess, function (sender, user) {
                apply(function () {
                    $scope.current.setUser(user);

                    if ($route.current.$$route.section && !AuthService.authorize(user, $route.current.$$route.section)) {
                        $scope.current.denied = true;
                    }
                    else {
                        $scope.current.denied = false;
                        if (typeof ($scope.current.restoreFn) === 'function') {
                            $scope.current.restoreFn();
                        }
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

        }]);
})();