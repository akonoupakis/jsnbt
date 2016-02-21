/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.AppControllerBase = (function (AppControllerBase) {

                AppControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {
                    
                    $scope.modal = $scope.modal;

                    if (!$scope.modal && $location.path() === '') {
                        $location.path('/');
                    }

                    $scope.root = true;

                    $scope.application = {

                        version: $jsnbt.version,
                        languages: [],
                        localization: $jsnbt.localization,
                        ssl: $jsnbt.ssl,
                        navigationSpec: [],
                        name: $jsnbt.name ? $jsnbt.name : {
                            image: 'img/core/logo.jpg',
                            title: 'v' + $jsnbt.version
                        }
                    };
                    
                    $scope.current = {

                        user: undefined,
                        users: false,
                        initiating: true,
                        restoreFn: undefined,
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

                    $rootScope.application = $scope.application;
                    $rootScope.current = $scope.current;
                    $rootScope.defaults = $scope.defaults;

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

                    var setDefaultLanguages = function () {
                        var deferred = $q.defer();

                        var results = $jsnbt.languages;

                        $scope.defaults.languages = results;

                        deferred.resolve(results);

                        return deferred.promise;
                    };

                    var setApplicationLanguages = function () {
                        var deferred = $q.defer();

                        $data.languages.get().then(function (results) {

                            var languages = _.sortBy(results, 'name');

                            $scope.application.languages = _.map(languages, function (x) {
                                x.image = 'img/core/flags/' + x.code + '.png';
                                return x;
                            });

                            deferred.resolve(languages);

                        }).catch(function (error) {
                            deferred.reject(error);
                        });

                        return deferred.promise;
                    };

                    var setDefaultLanguage = function () {
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
                        setApplicationLanguages().then(function () {
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
                        setApplicationLanguages();
                    });

                    $scope.getNodeBreadcrumb = function (node, prefix) {
                        return TreeNodeService.getBreadcrumb(node, $scope.defaults.language, prefix);
                    };

                    $scope.current.login = function (username, password) {
                        AuthService.login(username, password).then(function (user) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, user);
                        }).catch(function (error) {
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        });
                    };

                    $scope.current.logout = function () {
                        AuthService.logout().then(function () {
                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        });
                    };

                    $scope.isAuthorized = function (section) {
                        return AuthService.isAuthorized($scope.current.user, section);
                    };

                    $scope.$on(AUTH_EVENTS.noUsers, function (sender, fn) {
                        $scope.current.users = false;
                    });

                    $scope.$on(AUTH_EVENTS.userCreated, function (sender, fn) {
                        $scope.current.users = true;
                    });

                    $scope.$on(AUTH_EVENTS.authenticated, function (sender, user) {
                        $scope.current.users = true;
                        $scope.current.setUser(user);
                        $scope.current.initiating = false;
                    });

                    $scope.$on(AUTH_EVENTS.notAuthenticated, function (sender, fn) {
                        $scope.current.users = true;
                        $scope.current.setUser(null);
                        $scope.current.initiating = false;
                        $scope.current.restoreFn = fn;
                    });

                    $scope.$on(AUTH_EVENTS.loginSuccess, function (sender, user) {
                        $scope.current.setUser(user);

                        if (typeof ($scope.current.restoreFn) === 'function') {
                            $scope.current.restoreFn();
                        }
                    });


                    $router.$index = $router.$index || 0;
                    $router.$index++;

                    $scope.routeId = 'route-' + $router.$index;
                    
                    $scope.route = $router.create($scope.routeId, {
                        path: $scope.modal ? $scope.modal.path : ($location.path() || '/'),
                        redirect: $scope.modal ? false : true
                    });

                    $rootScope.$on('$locationChangeStart', function (event, next) {
                        if (($location.path() || '/') !== ($scope.route && $scope.route.current && $scope.route.current.path))
                            $scope.route.navigate($location.path() || '/');
                    });

                    $scope.route.on('success', function () {
                        if (!$scope.current.user) {
                            AuthService.get().then(function (user) {
                                if (!AuthService.isInRole(user, 'admin')) {
                                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                                        $scope.route.reload();
                                    });
                                }
                                else {
                                    $rootScope.$broadcast(AUTH_EVENTS.authenticated, user);
                                }
                            }, function () {
                                event.preventDefault();

                                if (!$rootScope.initiated) {
                                    AuthService.count().then(function (count) {

                                        if (count === 0) {
                                            $rootScope.$broadcast(AUTH_EVENTS.noUsers, function () {
                                                $scope.route.reload();
                                            });
                                        }
                                        else {
                                            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                                                $scope.route.reload();
                                            });
                                        }

                                        $rootScope.initiated = true;
                                    }).catch(function (error) {
                                        throw error;
                                    });
                                }
                                else {
                                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                                        $scope.route.reload();
                                    });
                                }

                            });
                        }
                        else {
                            if (!AuthService.isInRole($scope.current.user, 'admin')) {
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                                    $scope.route.reload();
                                });
                            }
                            else {
                                $rootScope.$broadcast(AUTH_EVENTS.authenticated, $scope.current.user);
                            }
                        }
                    });

                    $jsnbt.on('logoff', function (userId) {
                        if ($scope.current.user && $scope.current.user.id === userId) {
                            $timeout(function () {
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                                    $scope.route.reload();
                                });
                            });
                        }
                    });

                    $scope.$on('$destroy', function () {
                        $router.dispose($scope.routeId);
                    });

                    var initiated = false;
                    $scope.init = function () {
                        var deferred = $q.defer();

                        if (!initiated) {
                            setDefaultLanguages().then(function () {
                                setApplicationLanguages().then(function () {
                                    setDefaultLanguage().then(function () {
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
                
                return AppControllerBase;

            })(controllers.AppControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();