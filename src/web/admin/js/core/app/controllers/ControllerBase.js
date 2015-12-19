/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ControllerBase = (function (ControllerBase) {

                ControllerBase = function ($scope, $rootScope, $route, $routeParams, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, TreeNodeService, PagedDataService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {

                    var logger = $logger.create('ControllerBase');

                    var self = this;

                    this.scope = $scope;

                    this.controls = [];

                    this.ctor = {
                        $rootScope: $rootScope,
                        $route: $route,
                        $routeParams: $routeParams,
                        $location: $location,
                        $logger: $logger,
                        $q: $q,
                        $timeout: $timeout,
                        $data: $data,
                        $jsnbt: $jsnbt,
                        LocationService: LocationService,
                        ScrollSpyService: ScrollSpyService,
                        AuthService: AuthService,
                        TreeNodeService: TreeNodeService,
                        PagedDataService: PagedDataService,
                        ModalService: ModalService,
                        CONTROL_EVENTS: CONTROL_EVENTS,
                        AUTH_EVENTS: AUTH_EVENTS,
                        DATA_EVENTS: DATA_EVENTS,
                        ROUTE_EVENTS: ROUTE_EVENTS,
                        MODAL_EVENTS: MODAL_EVENTS
                    };

                    this.queue = {};

                    if (_.isObject($route.current) && _.isObject($route.current.$$route) && _.isObject($route.current.$$route.scope))
                        for (var scopeProperty in $route.current.$$route.scope) 
                            $scope[scopeProperty] = $route.current.$$route.scope[scopeProperty];
                    
                    $scope.localization = false;
                    $scope.languages = [];

                    $scope.breadcrumb = true;
               
                    $scope.back = function () {
                        $scope.current.breadcrumb.items.pop();
                        var lastItem = _.last($scope.current.breadcrumb.items);
                        if (lastItem) {
                            $location.previous(lastItem.url);
                        }
                        else {
                            logger.warn('previous breadcrumb item not found. implement the back() function to override');
                        }
                    };

                    $scope.goto = function (path) {
                        $location.goto(path);
                    };

                    $scope.previous = function (path) {
                        $location.previous(path);
                    };

                    $scope.next = function (path) {
                        $location.next(path);
                    };

                    $scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                        sender.stopPropagation();

                        self.controls.push(control);
                    });
                    
                };

                ControllerBase.prototype.enqueue = function (queue, key, fn) {

                    if (!this.queue[queue])
                        this.queue[queue] = [];

                    this.queue[queue].push({
                        key: key,
                        fn: fn
                    });
                };

                ControllerBase.prototype.dequeue = function (queue, key) {
                    if (this.queue[queue]) {
                        this.queue[queue] = _.filter(this.queue[queue], function (x) { return x.key !== key });
                    }
                };

                ControllerBase.prototype.getBreadcrumb = function () {
                    var deferred = this.ctor.$q.defer();

                    var breadcrumb = this.ctor.LocationService.getBreadcrumb();

                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                };

                ControllerBase.prototype.setBreadcrumb = function(breadcrumb) {

                    var deferred = this.ctor.$q.defer();

                    if (this.scope.current)
                        this.scope.current.setBreadcrumb(breadcrumb);

                    deferred.resolve();

                    return deferred.promise;

                };

                ControllerBase.prototype.run = function (queue, args) {
                    var deferred = this.ctor.$q.defer();

                    if (this.queue[queue]) {
                        this.ctor.$q.all(_.map(this.queue[queue], function (x) { return x.fn.apply(x.fn, args); })).then(function () {
                            deferred.resolve();
                        }).catch(function (error) {
                            deferred.reject(error);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                ControllerBase.prototype.init = function () {
                    var deferred = this.ctor.$q.defer();

                    var self = this;

                    var proceed = function () {
                        self.getBreadcrumb().then(function (breadcrumb) {
                            self.setBreadcrumb(breadcrumb).then(function () {
                                deferred.resolve();
                            }).catch(function (ex) {
                                deferred.reject(ex);
                            });
                        });
                    };

                    self.scope.languages = self.scope.application.languages;
              
                    if (self.scope.$parent && self.scope.root && typeof (self.scope.$parent.init) === 'function') {
                        self.ctor.$rootScope.controller = self;

                        self.scope.$parent.init().then(function () {
                            proceed();
                        }).catch(function (ex) {
                            deferred.reject(ex);
                        });
                    }
                    else {
                        deferred.resolve();
                    }

                    return deferred.promise;
                };

                return ControllerBase;

            })(controllers.ControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();