/* global angular:false */

(function () {

    "use strict";

    var modules = jsnbt.jsModules.slice(0);
    modules.push('ngRoute');
    modules.push('ngAnimate');
    modules.push('ngSanitize');
    modules.push('mgcrea.ngStrap');
    modules.push('ui.bootstrap');
    modules.push('ui.sortable');
    modules.push('infinite-scroll');
    modules.push('flow');
    modules.push('ui.tinymce');
    
    angular.module('jsnbt', modules)
    .config(function ($routeProvider, $jsnbtProvider, flowFactoryProvider) {
        
        $jsnbtProvider.setSettings(jsnbt);

        $routeProvider.
            when('/', {
                templateUrl: 'tmpl/core/pages/dashboard.html',
                controller: 'DashboardController'
            }).
            when('/content', {
                templateUrl: 'tmpl/core/pages/content.html',
                controller: 'ContentController'
            });

        if (jsnbt.localization.enabled) {
            $routeProvider.
                when('/content/languages', {
                    templateUrl: 'tmpl/core/pages/content/languages.html',
                    controller: 'LanguagesController',
                    section: 'languages'
                }).
                when('/content/languages/:id', {
                    templateUrl: 'tmpl/core/pages/content/language.html',
                    controller: 'LanguageController',
                    section: 'languages'
                });
        }

        $routeProvider.
            when('/content/layouts', {
                templateUrl: 'tmpl/core/pages/content/layouts.html',
                controller: 'LayoutsController',
                section: 'layouts'
            }).
            when('/content/layouts/:id', {
                templateUrl: 'tmpl/core/pages/content/layout.html',
                controller: 'LayoutController',
                section: 'layouts'
            }).
            when('/content/nodes', {
                templateUrl: 'tmpl/core/pages/content/nodes.html',
                controller: 'NodesController',
                section: 'nodes'
            }).
            when('/content/nodes/:id', {
                templateUrl: 'tmpl/core/pages/content/node.html',
                controller: 'NodeController',
                section: 'nodes'
            }).
            when('/content/data', {
                templateUrl: 'tmpl/core/pages/content/data.html',
                controller: 'DataController',
                section: 'data'
            }).
            when('/content/data/:domain/:list', {
                templateUrl: 'tmpl/core/pages/content/list.html',
                controller: 'ListController',
                section: 'data'
            }).
            when('/content/data/:domain/:list/:id', {
                templateUrl: 'tmpl/core/pages/content/list-entry.html',
                controller: 'ListEntryController',
                section: 'data'
            }).
            when('/content/texts', {
                templateUrl: 'tmpl/core/pages/content/texts.html',
                controller: 'TextsController',
                section: 'texts'
            }).
            when('/content/texts/:id', {
                templateUrl: 'tmpl/core/pages/content/text.html',
                controller: 'TextController',
                section: 'texts'
            }).
            when('/content/files', {
                templateUrl: 'tmpl/core/pages/content/files.html',
                controller: 'FilesController',
                section: 'files'
            }).
            when('/modules', {
                templateUrl: 'tmpl/core/pages/modules.html',
                controller: 'ModulesController',
                section: 'modules'
            }).
            when('/modules/:domain/list/:list', {
                templateUrl: 'tmpl/core/pages/content/list.html',
                controller: 'ListController'
            }).
            when('/modules/:domain/list', {
                redirectTo: '/modules/:domain'
            }).
            when('/modules/:domain/list/:list/:id', {
                templateUrl: 'tmpl/core/pages/content/list-entry.html',
                controller: 'ListEntryController'
            }).
            when('/users', {
                templateUrl: 'tmpl/core/pages/users.html',
                 controller: 'UsersController',
                 section: 'users'
            }).
            when('/users/:id', {
                templateUrl: 'tmpl/core/pages/user.html',
                controller: 'UserController',
                section: 'users'
            }).
            when('/settings', {
                templateUrl: 'tmpl/core/pages/settings.html',
                controller: 'SettingsController',
                section: 'settings',
                domain: 'core',
                tmpl: 'tmpl/core/specs/settings.html'
            }).
            otherwise({
                redirectTo: '/'
            });

        flowFactoryProvider.defaults = {
            target: '/jsnbt-upload',
            permanentErrors: [500, 501],
            maxChunkRetries: 1,
            chunkRetryInterval: 5000,
            simultaneousUploads: 1
        };

        tinymce.baseURL = '/admin/css/core/lib/tinymce';
    })
    .run(function ($rootScope, $location, $route, $timeout, $fn, FunctionService, AuthService, AUTH_EVENTS, ROUTE_EVENTS) {
        $fn.register('core', FunctionService);
        
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
                    var currentSection = $route.current.$$route.section;
                    if (currentSection) {
                        if (!AuthService.authorize(user, currentSection)) {
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
                    }, function (error) {
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

    });
})();