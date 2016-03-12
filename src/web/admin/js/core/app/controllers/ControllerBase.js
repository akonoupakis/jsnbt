/* global angular:false */

(function () {
    "use strict";

    (function (jsnbt) {

        jsnbt.controllers = (function (controllers) {

            controllers.ControllerBase = (function (ControllerBase) {

                ControllerBase = function ($scope, $rootScope, $router, $location, $logger, $q, $timeout, $data, $jsnbt, LocationService, ScrollSpyService, AuthService, FileService,NodeService, ModalService, CONTROL_EVENTS, AUTH_EVENTS, DATA_EVENTS, ROUTE_EVENTS, MODAL_EVENTS) {

                    var logger = $logger.create('ControllerBase');

                    var self = this;

                    this.scope = $scope;

                    this.controls = [];

                    this.ctor = {
                        $rootScope: $rootScope,
                        $router: $router,
                        $location: $location,
                        $logger: $logger,
                        $q: $q,
                        $timeout: $timeout,
                        $data: $data,
                        $jsnbt: $jsnbt,
                        LocationService: LocationService,
                        ScrollSpyService: ScrollSpyService,
                        AuthService: AuthService,
                        FileService: FileService,
                        NodeService: NodeService,
                        ModalService: ModalService,
                        CONTROL_EVENTS: CONTROL_EVENTS,
                        AUTH_EVENTS: AUTH_EVENTS,
                        DATA_EVENTS: DATA_EVENTS,
                        ROUTE_EVENTS: ROUTE_EVENTS,
                        MODAL_EVENTS: MODAL_EVENTS
                    };

                    this.queue = {};

                    $scope.denied = false;
                    $scope.found = true;
                    $scope.loading = true;

                    $scope.localization = false;
                    $scope.languages = [];

                    $scope.breadcrumb = true;
                    $scope.selector = $scope.selector || '';
               
                    $scope.back = function () {
                        $scope.current.breadcrumb.items.pop();
                        var lastItem = _.last($scope.current.breadcrumb.items);
                        if (lastItem) {
                            $scope.route.previous(lastItem.url);
                        }
                        else {
                            logger.warn('previous breadcrumb item not found. implement the back() function to override');
                        }
                    };

                    $scope.$on(CONTROL_EVENTS.register, function (sender, control) {
                        sender.stopPropagation();

                        self.controls.push(control);
                    });
                    
                    if ($scope.modal && (!$scope.modal.selector || ($scope.modal.selector && ($scope.modal.selector === $scope.selector)))) {
                        $scope.$on(MODAL_EVENTS.valueRequested, function (sender) {
                            self.requested();
                        });

                        $scope.$on(CONTROL_EVENTS.valueSelected, function (sender, selected) {
                            sender.stopPropagation();
                            self.selected(selected);
                        });

                        $scope.$on(CONTROL_EVENTS.valueSubmitted, function (sender, selected) {
                            sender.stopPropagation();
                            self.submitted(selected);
                        });
                    }

                    $scope.$on('destroy', this.destroy);
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

                ControllerBase.prototype.authorize = function () {
                    var deferred = this.ctor.$q.defer();

                    if (this.scope.current.user) {
                        var currentSection = this.scope.route.current && this.scope.route.current.section;
                        if (currentSection) {
                            var authorized = this.ctor.AuthService.isAuthorized(this.scope.current.user, currentSection);
                            this.scope.denied = !authorized;
                            deferred.resolve(authorized);
                        }
                        else {
                            deferred.resolve(true);
                        }
                    }
                    else {
                        this.scope.denied = true;
                        deferred.resolve(false);
                    }

                    return deferred.promise;
                };

                ControllerBase.prototype.getBreadcrumb = function () {
                    var deferred = this.ctor.$q.defer();

                    var breadcrumb = this.ctor.LocationService.getBreadcrumb(this.scope.route && this.scope.route.current);

                    deferred.resolve(breadcrumb);

                    return deferred.promise;
                };

                ControllerBase.prototype.setBreadcrumb = function(breadcrumb) {

                    var deferred = this.ctor.$q.defer();

                    if (this.scope.current && this.scope.route)
                        this.scope.current.setBreadcrumb(breadcrumb);

                    deferred.resolve();

                    return deferred.promise;

                };

                ControllerBase.prototype.requested = function () {
                    throw new Error('not implemented');
                };

                ControllerBase.prototype.selected = function (selected) {
                    throw new Error('not implemented');
                };

                ControllerBase.prototype.submitted = function (selected) {
                    throw new Error('not implemented');
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

                    var resolve = function () {
                        self.scope.loading = false;
                        deferred.resolve();
                    };

                    var reject = function (ex) {
                        self.scope.loading = false;
                        deferred.reject(ex);
                    };

                    var proceed = function () {
                        self.authorize().then(function (authorized) {
                            self.getBreadcrumb().then(function (breadcrumb) {
                                self.setBreadcrumb(breadcrumb).then(resolve).catch(reject);
                            }).catch(reject);
                        }).catch(reject);
                    };

                    self.scope.languages = self.scope.application.languages;
              
                    if (self.scope.$parent && self.scope.root && typeof (self.scope.$parent.init) === 'function') {

                        self.scope.$parent.init().then(function () {
                            proceed();
                        }).catch(reject);
                    }
                    else {
                        resolve();
                    }

                    return deferred.promise;
                };

                ControllerBase.prototype.destroy = function () {

                };

                return ControllerBase;

            })(controllers.ControllerBase || {});

            return controllers;

        })(jsnbt.controllers || {});

        return jsnbt;

    })(jsnbt || {});

})();