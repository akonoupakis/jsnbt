/* global angular:false */

(function () {
    "use strict";

    angular.module('jsnbt')
    .config(['$routeProvider', '$jsnbtProvider', 'flowFactoryProvider', function ($routeProvider, $jsnbtProvider, flowFactoryProvider) {

        $jsnbtProvider.setSettings(jsnbt);

        var router = new jsnbt.ViewRouter('core', $routeProvider);

        var TEMPLATE_BASE = jsnbt.constants.TEMPLATE_BASE;

        router.when('/', function (x) {
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/dashboard.html');
            x.controller('DashboardController');
        });

        router.when('/dashboard', function (x) {
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/dashboard.html');
            x.controller('DashboardController');
        });

        router.when('/content', function (x) {
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/content.html');
            x.controller('ContentController');
        });

        if (jsnbt.localization.enabled) {
            router.when('/content/languages', function (x) {
                x.section('languages');
                x.baseTemplate(TEMPLATE_BASE.list);
                x.template('tmpl/core/pages/content/languages.html');
                x.controller('LanguagesController');
            });
            router.when('/content/languages/:id', function (x) {
                x.section('languages');
                x.baseTemplate(TEMPLATE_BASE.form);
                x.template('tmpl/core/pages/content/language.html');
                x.controller('LanguageController');
            });
        }

        router.when('/content/layouts', function (x) {
            x.section('layouts');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/layouts.html');
            x.controller('LayoutsController');
        });
        router.when('/content/layouts/:id', function (x) {
            x.section('layouts');
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/content/layout.html');
            x.controller('LayoutController');
        });

        router.when('/content/nodes', function (x) {
            x.section('nodes');
            x.baseTemplate(TEMPLATE_BASE.tree);
            x.template('tmpl/core/pages/content/nodes.html');
            x.scope({
                prefix: '/content/nodes'
            });
            x.controller('NodesController');
        });
        router.when('/content/nodes/:id', function (x) {
            x.section('nodes');
            x.baseTemplate(TEMPLATE_BASE.nodeForm);
            x.scope({
                prefix: '/content/nodes'
            });
            x.controller('NodeController');
        });

        router.when('/content/data', function (x) {
            x.section('data');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/data.html');
            x.controller('DataController');
        });
        router.when('/content/data/:list', function (x) {
            x.section('data');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/dataList.html');
            x.controller('DataListController');
        });
        router.when('/content/data/:list/:id', function (x) {
            x.section('data');
            x.baseTemplate(TEMPLATE_BASE.dataForm);
            x.controller('DataListItemController');
        });

        router.when('/modules', function (x) {
            x.section('modules');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/modules.html');
            x.controller('ModulesController');
        });

        router.when('/content/texts', function (x) {
            x.section('texts');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/content/texts.html');
            x.controller('TextsController');
        });
        router.when('/content/texts/:id', function (x) {
            x.section('texts');
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/content/text.html');
            x.controller('TextController');
        });

        router.when('/content/files', function (x) {
            x.section('files');
            x.baseTemplate(TEMPLATE_BASE.base);
            x.template('tmpl/core/pages/content/files.html');
            x.controller('FilesController');
        });

        router.when('/users', function (x) {
            x.section('users');
            x.baseTemplate(TEMPLATE_BASE.list);
            x.template('tmpl/core/pages/users.html');
            x.controller('UsersController');
        });
        router.when('/users/:id', function (x) {
            x.section('users');
            x.baseTemplate(TEMPLATE_BASE.form);
            x.template('tmpl/core/pages/user.html');
            x.controller('UserController');
        });

        router.when('/settings', function (x) {
            x.section('settings');
            x.baseTemplate(TEMPLATE_BASE.settings);
            x.template('tmpl/core/pages/settings.html');
            x.controller('SettingsController');
        });

        router.otherwise(function (x) {
            x.redirect('/');
        });

    }])
    .run(['$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', 
        function ($rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {

            $rootScope.controller = {
                register: function () { }
            };

            $rootScope.initiated = $rootScope.initiated || false;
            $rootScope.users = 0;

            var history = [];

            $rootScope.back = function () {
                var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
                $location.previous(prevUrl);
            };

            $rootScope.location = $rootScope.location || {};

            $rootScope.$on('$locationChangeStart', function (event, next) {
                $rootScope.$broadcast(ROUTE_EVENTS.routeStarted);
                
                AuthService.get().then(function (user) {
                    $rootScope.$broadcast(ROUTE_EVENTS.routeCompleted);
                    if (!AuthService.isInRole(user, 'admin')) {
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                            $route.reload();
                        });
                    }
                    else {
                        $rootScope.$broadcast(AUTH_EVENTS.authenticated, user);
                        var currentSection = $route.current.$$route && $route.current.$$route.section;
                        if (currentSection) {
                            if (!AuthService.isAuthorized(user, currentSection)) {
                                $rootScope.$broadcast(AUTH_EVENTS.accessDenied);
                            }
                        }
                    }
                }, function () {
                    event.preventDefault();

                    if (!$rootScope.initiated) {
                        
                        AuthService.count().then(function (count) {
                            $rootScope.$broadcast(ROUTE_EVENTS.routeCompleted);
                            
                            if (count === 0) {
                                $rootScope.$broadcast(AUTH_EVENTS.noUsers, function () {
                                    $route.reload();
                                });
                            }
                            else {
                                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                                    $route.reload();
                                });
                            }

                            $rootScope.initiated = true;
                        }).catch(function (error) {
                            throw error;
                        });
                    }
                    else {
                        $rootScope.$broadcast(ROUTE_EVENTS.routeCompleted);

                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                            $route.reload();
                        });
                    }

                });
            });

            $rootScope.$on("$routeChangeStart", function () {
                if ($rootScope.location.leaving) {
                    $rootScope.location.coming = true;
                }
            });

            $rootScope.$on('$routeChangeSuccess', function () {
                if ($rootScope.location.direction === 'rtl') {
                    history.pop();
                    $rootScope.location.previous = history[history.length - 2];
                }
                else {
                    history.push($location.$$path);

                    if (history.length > 10)
                        history = history.splice(history.length - 5);

                    if ($rootScope.location.coming) {
                        $rootScope.location.previous = history[history.length - 2];
                    }

                    $('body').scrollTo($('body'), { duration: 400 });
                }

                $timeout(function () {
                    if ($rootScope.location.coming) {
                        $rootScope.location.direction = '';
                        $rootScope.location.leaving = false;
                        $rootScope.location.coming = false;
                    }
                }, 1000);
            });

            $location.goto = function (path) {
                $rootScope.location.direction = undefined;
                $rootScope.location.coming = false;
                $rootScope.location.leaving = false;
                $location.path(path);
            };

            $location.next = function (path) {
                $rootScope.location.direction = 'ltr';
                $rootScope.location.coming = false;
                $rootScope.location.leaving = true;
                $location.path(path);
            };

            $location.previous = function (path) {
                $rootScope.location.direction = 'rtl';
                $rootScope.location.coming = false;
                $rootScope.location.leaving = true;
                $location.path(path);
            };

        }]);
})();