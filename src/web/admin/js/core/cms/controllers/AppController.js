/* global angular:false */

(function () {
    "use strict";

    var AppController = function ($scope, $rootScope, $router, $logger, $q, $timeout, $data, $jsnbt, RouteService, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.controllers.Controller.apply(this, $rootScope.getBaseArguments($scope));
        
        var logger = $logger.create('AppController');

        $scope.current.users = false;
        $scope.current.denied = false;
        $scope.current.initiated = false;
        
        $scope.current.restoreFn = undefined;
        
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
        
        $scope.$on(ROUTE_EVENTS.routeStarted, function (sender) {
            $scope.current.initiated = false;
        });

        $scope.$on(ROUTE_EVENTS.routeCompleted, function (sender) {
            $scope.current.initiated = true;
        });

        $scope.$on(AUTH_EVENTS.noUsers, function (sender, fn) {
            $scope.current.users = false;
        });

        $scope.$on(AUTH_EVENTS.userCreated, function (sender, fn) {
            $scope.current.users = true;
        });

        $scope.$on(AUTH_EVENTS.authenticated, function (sender, user) {
            $scope.current.users = true;
            $scope.current.denied = false;
            $scope.current.setUser(user);
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function (sender, fn) {
            $scope.current.users = true;
            $scope.current.denied = false;
            $scope.current.setUser(null);
            $scope.current.restoreFn = fn;
        });

        $scope.$on(AUTH_EVENTS.accessDenied, function (sender) {
            $scope.current.denied = true;
        });

        $scope.$on(AUTH_EVENTS.loginSuccess, function (sender, user) {
            $scope.current.setUser(user);

            if ($scope.route.current && $scope.route.current.section && !AuthService.isAuthorized(user, $scope.route.current.section)) {
                $scope.current.denied = true;
            }
            else {
                $scope.current.denied = false;
                if (typeof ($scope.current.restoreFn) === 'function') {
                    $scope.current.restoreFn();
                }
            }
        });

        $scope.route.on('start', function () {
            checkUser();
        });
                
        var checkUser = function () {
            $rootScope.$broadcast(ROUTE_EVENTS.routeStarted);

            AuthService.get().then(function (user) {
                $rootScope.$broadcast(ROUTE_EVENTS.routeCompleted);
                if (!AuthService.isInRole(user, 'admin')) {
                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                        $scope.route.reload();
                    });
                }
                else {
                    $rootScope.$broadcast(AUTH_EVENTS.authenticated, user);
                    var currentSection = $scope.route.current && $scope.route.current.section;
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
                    $rootScope.$broadcast(ROUTE_EVENTS.routeCompleted);

                    $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, function () {
                        $route.reload();
                    });
                }

            });
        };
    };
    AppController.prototype = Object.create(jsnbt.controllers.Controller.prototype);

    angular.module("jsnbt")
        .controller('AppController', ['$scope', '$rootScope', '$router', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'RouteService', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', AppController]);


    var PageController = function ($scope, $rootScope, $router, $logger, $q, $timeout, $data, $jsnbt, RouteService, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        
        $scope.route.on('success', function () {
            $('body').scrollTo($('body'), { duration: 400 });
        });

    };

    angular.module("jsnbt")
        .controller('PageController', ['$scope', '$rootScope', '$router', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'RouteService', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', PageController]);

    var ModalPageController = function ($scope, $rootScope, $router, $logger, $q, $timeout, $data, $jsnbt, RouteService, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        AppController.apply(this, $rootScope.getBaseArguments($scope));

        $scope.route.on('success', function () {
            var modalElement = $('.modal:last > .modal-dialog > .modal-content > div > .modal-body');
            modalElement.scrollTo(modalElement, { duration: 600 });
        });

    };
    ModalPageController.prototype = Object.create(AppController.prototype);

    angular.module("jsnbt")
        .controller('ModalPageController', ['$scope', '$rootScope', '$router', '$logger', '$q', '$timeout', '$data', '$jsnbt', 'RouteService', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', ModalPageController]);
})();