/* global angular:false */

(function () {
    "use strict";

    var AppController = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, $fn, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS) {
        jsnbt.controllers.Controller.apply(this, $rootScope.getBaseArguments($scope));

        var logger = $logger.create('AppController');
       

        $scope.current.users = false;
        $scope.current.denied = false;
        $scope.current.initiated = false;
        
        $scope.current.restoreFn = undefined;

        $scope.goto = function (path) {
            $location.goto(path);
        };


        $scope.getNodeBreadcrumb = function (node, prefix) {

            var deferred = $q.defer();

            var setLocInternal = function (hierarchy) {
                $data.nodes.get({ id: { $in: hierarchy } }).then(function (results) {

                    var breadcrumb = [];

                    $(hierarchy).each(function (i, item) {
                        if (item === 'new') {
                            breadcrumb.push({
                                name: 'new',
                                url: '',
                                active: true
                            });
                        }
                        else {
                            var resultNode = _.first(_.filter(results, function (x) { return x.id === item; }));
                            if (resultNode) {

                                var nameValue = resultNode.title[$scope.defaults.language];

                                var url = '';
                                if ($jsnbt.entities[resultNode.entity].viewable)
                                    url = $jsnbt.entities[resultNode.entity].getViewUrl(resultNode, prefix);
                                else if ($jsnbt.entities[resultNode.entity].editable)
                                    url = $jsnbt.entities[resultNode.entity].getEditUrl(resultNode, prefix);

                                breadcrumb.push({
                                    id: item,
                                    name: nameValue,
                                    url: url,
                                    active: i === (hierarchy.length - 1)
                                });
                            }
                        }
                    });

                    deferred.resolve(breadcrumb);

                }).catch(function (error) {
                    deferred.reject(error);
                });
            };

            var hierarchy = [];
            if (node) {
                if (node.parent && node.parent !== '') {
                    $data.nodes.get(node.parent).then(function (nodeResult) {
                        hierarchy = nodeResult.hierarchy.slice(0);
                        if (node.id)
                            hierarchy.push(node.id);

                        setLocInternal(hierarchy);
                    }, function (parentError) {
                        deferred.reject(parentError);
                    });
                }
                else {
                    hierarchy = [];
                    if (node.id)
                        hierarchy.push(node.id);

                    setLocInternal(hierarchy);
                }
            }
            else {
                setLocInternal([]);
            }

            return deferred.promise;
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
            return AuthService.authorize($scope.current.user, section);
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
            $scope.current.denied = false;
            $scope.current.setUser(user);
        });

        $scope.$on(AUTH_EVENTS.notAuthenticated, function (sender, fn) {
            $scope.current.denied = false;
            $scope.current.setUser(null);
            $scope.current.restoreFn = fn;
        });

        $scope.$on(AUTH_EVENTS.accessDenied, function (sender) {
            $scope.current.denied = true;
        });

        $scope.$on(AUTH_EVENTS.loginSuccess, function (sender, user) {
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

        //fn.setDefaultLanguages().then(function () {
        //    fn.setApplicationLanguages().then(function () {
        //        fn.setDefaultLanguage().then(function () {
        //            console.log('1 -');
        //        }, function (dlError) {
        //            logger.error(dlError);
        //        });
        //    }, function (alsError) {
        //        logger.error(alsError);
        //    });
        //}, function (dlsError) {
        //    logger.error(dlsError);
        //});

    };
    AppController.prototype = Object.create(jsnbt.controllers.Controller.prototype);

    angular.module("jsnbt")
        .controller('AppController', ['$scope', '$rootScope', '$route', '$routeParams', '$location', '$logger', '$q', '$timeout', '$data', '$jsnbt', '$fn', 'LocationService', 'ScrollSpyService', 'AuthService', 'TreeNodeService', 'PagedDataService', 'ModalService', 'CONTROL_EVENTS', 'AUTH_EVENTS', 'DATA_EVENTS', 'ROUTE_EVENTS', AppController]);
})();