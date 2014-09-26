/* global angular:false */

(function () {

    "use strict";

    var modules = jsnbt.modules.slice(0);
    modules.push('ngRoute');
    modules.push('ngAnimate');
    modules.push('mgcrea.ngStrap');
    modules.push('frapontillo.bootstrap-switch');
    modules.push('ui.bootstrap');
    modules.push('ui.sortable');
    modules.push('infinite-scroll');
    modules.push('flow');
    modules.push('ui.tinymce');
    
    angular.module('jsnbt', modules)
    .config(function ($routeProvider, flowFactoryProvider) {
        
        $routeProvider.
            when('/', {
                templateUrl: 'tmpl/partial/dashboard.html',
                controller: 'DashboardController'
            }).
            when('/content', {
                templateUrl: 'tmpl/partial/content.html',
                controller: 'ContentController'
            }).
            when('/content/languages', {
                templateUrl: 'tmpl/partial/content/languages.html',
                controller: 'LanguagesController'
            }).
            when('/content/languages/:id', {
                templateUrl: 'tmpl/partial/content/language.html',
                controller: 'LanguageController'
            }).
            when('/content/nodes', {
                templateUrl: 'tmpl/partial/content/nodes.html',
                controller: 'NodesController'
            }).
            when('/content/nodes/:id', {
                templateUrl: 'tmpl/partial/content/node.html',
                controller: 'NodeController'
            }).
            when('/content/data', {
                templateUrl: 'tmpl/partial/content/data.html',
                controller: 'DataController'
            }).
            when('/content/data/:domain/:list', {
                templateUrl: 'tmpl/partial/content/list.html',
                controller: 'ListController'
            }).
            when('/content/data/:domain/:list/:id', {
                templateUrl: 'tmpl/partial/content/list-entry.html',
                controller: 'ListEntryController'
            }).
            when('/content/texts', {
                templateUrl: 'tmpl/partial/content/texts.html',
                controller: 'TextsController'
            }).
            when('/content/texts/:id', {
                templateUrl: 'tmpl/partial/content/text.html',
                controller: 'TextController'
            }).
            when('/content/files', {
                templateUrl: 'tmpl/partial/content/files.html',
                controller: 'FilesController'
            }).
            when('/addons', {
                templateUrl: 'tmpl/partial/addons.html',
                controller: 'AddonsController'
            }).
            when('/addons/:domain/list/:list', {
                templateUrl: 'tmpl/partial/content/list.html',
                controller: 'ListController'
            }).
            when('/addons/:domain/list', {
                redirectTo: '/addons/:domain'
            }).
            when('/addons/:domain/list/:list/:id', {
                templateUrl: 'tmpl/partial/content/list-entry.html',
                controller: 'ListEntryController'
            }).
             when('/users', {
                 templateUrl: 'tmpl/partial/users.html',
                 controller: 'UsersController'
             }).
            when('/settings', {
                templateUrl: 'tmpl/partial/settings.html',
                controller: 'SettingsController',
                domain: 'core',
                tmpl: 'tmpl/partial/settings/settings.html'
            }).
            when('/test', {
                templateUrl: 'tmpl/partial/test.html',
                controller: 'TestController'
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

        tinymce.baseURL = '/admin/css/lib/tinymce';
    })
    .run(function ($rootScope, $location, $route, $timeout, $fn, FunctionService, AuthService, AUTH_EVENTS) {
        $fn.register('core', FunctionService);

        $rootScope.initiated = $rootScope.initiated || false;
        $rootScope.users = 0;
        
        var history = [];

        $rootScope.back = function () {
            var prevUrl = history.length > 1 ? history.splice(-2)[0] : "/";
            $location.path(prevUrl);
        };

        $rootScope.location = $rootScope.location || {};

        $rootScope.$on('$locationChangeStart', function (event, next, a, b, c) {
            AuthService.get().then(function (user) {
                $rootScope.$broadcast(AUTH_EVENTS.authenticated, user);
            }, function () {
                event.preventDefault();
                if (!$rootScope.initiated) {
                    AuthService.count().then(function (count) {
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
            }

            $timeout(function () {
                if ($rootScope.location.coming) {
                    $rootScope.location.direction = '';
                    $rootScope.location.leaving = false;
                    $rootScope.location.coming = false;
                }
            }, 1000);
        });
        
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