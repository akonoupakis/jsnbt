(function () {
    "use strict";
    
    (function (jsnbt) {
   
        jsnbt.ViewRouter = (function (ViewRouter) {

            var createRoutingMethods = function (domain) {

                var routingOptions = {
                    domain: domain,
                    section: undefined,
                    controller: undefined,
                    baseTemplate: undefined,
                    template: undefined,
                    scope: {
                        //domain: undefined,
                        //section: undefined,
                        //prefix: ''
                    },
                    redirectTo: undefined
                };

                var routingMethods = {};
                routingMethods.controller = function (controller) {
                    routingOptions.controller = controller;
                };

                routingMethods.baseTemplate = function (template) {
                    routingOptions.baseTemplate = template;
                };

                routingMethods.template = function (template) {
                    routingOptions.template = template;
                };
                
                routingMethods.section = function (section) {
                    routingOptions.section = section;
                    //routingOptions.scope.section = section;
                };

                routingMethods.scope = function (scope) {
                    $.extend(true, routingOptions.scope, scope);
                };

                routingMethods.redirect = function (path) {
                    routingOptions.redirectTo = path;
                };

                routingMethods.get = function () {
                    return routingOptions;
                };

                return routingMethods;

            };

            var navigate = function (router, options, path, cb) {

                var search = {};

                function switchRouteMatcher(on, route) {
                    var keys = route.keys,
                        params = {};

                    if (!route.regexp) return null;

                    var m = route.regexp.exec(on);
                    if (!m) return null;

                    for (var i = 1, len = m.length; i < len; ++i) {
                        var key = keys[i - 1];

                        var val = m[i];

                        if (key && val) {
                            params[key.name] = val;
                        }
                    }
                    return params;
                }

                function parseRoute(path, vcb) {
                    var params, match;
                    angular.forEach(router.routes, function (route) {
                        if (!match && (params = switchRouteMatcher(path, route))) {
                            match = angular.extend(route, {
                                params: angular.extend({}, search, params),
                                pathParams: params
                            });
                        }
                    });

                    vcb(null, match || router.routes[null] && angular.extend(router.routes[null], { params: {}, pathParams: {} }));
                }
                
                function commitRoute(route, vcb) {
                    var nextRoute = route;

                    if (nextRoute && options.redirect === true)
                        window.location.hash = '#' + path;

                    vcb(null, nextRoute);
                }

                parseRoute(path, function (err, route) {
                    if (err)
                        return cb(err);

                    if (route) {
                        commitRoute(route, function (commitedErr, commitedRoute) {
                            cb(commitedErr, commitedRoute);
                        });
                    }
                    else {
                        cb(null, null)
                    }
                });

            };


            var Route = function (router, options) {
                this.router = router;
                this.current = undefined;
                this.options = options;

                this.events = {
                    start: [],
                    success: [],
                    error: []
                };
            };

            Route.prototype.init = function (path) {
                var self = this;

                self.trigger('start', []);
                navigate(this.router, this.options, path, function (err, route) {
                    if (err) {
                        self.current = undefined;
                        self.trigger('error', [err]);
                    }
                    else {
                        self.current = route;
                        self.trigger('success', [route]);
                    }
                });
            };

            Route.prototype.navigate = function (path) {
                var self = this;

                this.direction = undefined;
                this.coming = false;
                this.leaving = false;

                self.trigger('start', []);
                navigate(this.router, this.options, path, function (err, route) {
                    if (err) {
                        self.current = undefined;
                        self.trigger('error', [err]);
                    }
                    else {
                        self.current = route;
                        self.trigger('success', [route]);
                    }

                    setTimeout(function () {
                        //if (self.coming) {
                            self.direction = '';
                            self.leaving = false;
                            self.coming = false;
                        //}
                    }, 1000);
                });
            };

            Route.prototype.previous = function (path) {
                var self = this;

                this.direction = 'rtl';
                this.coming = false;
                this.leaving = true;

                self.trigger('start', []);

                this.coming = true;

                navigate(this.router, this.options, path, function (err, route) {
                    if (err) {
                        self.current = undefined;
                        self.trigger('error', [err]);
                    }
                    else {
                        self.current = route;
                        self.trigger('success', [route]);
                    }

                    setTimeout(function () {
                        if (self.coming) {
                            self.direction = '';
                            self.leaving = false;
                            self.coming = false;
                        }
                    }, 1000);
                });
            };

            Route.prototype.next = function (path) {
                var self = this;

                this.direction = 'ltr';
                this.coming = false;
                this.leaving = false;

                //    if ($scope.route.leaving) {
                //        $scope.route.coming = true;
                //    }

                self.trigger('start', []);
                navigate(this.router, this.options, path, function (err, route) {
                    if (err) {
                        self.current = undefined;
                        self.trigger('error', [err]);
                    }
                    else {
                        self.current = route;
                        self.trigger('success', [route]);
                    }

                    setTimeout(function () {
                        if (self.coming) {
                            self.direction = '';
                            self.leaving = false;
                            self.coming = false;
                        }
                    }, 1000);
                });
            };

            Route.prototype.on = function (name, fn) {
                if (this.events[name]) {
                    this.events[name].push(fn);
                }
            };

            Route.prototype.trigger = function (name, args) {
                if (this.events[name]) {
                    for (var i = 0; i < this.events[name].length; i++) {
                        this.events[name][i].apply(this.events[name][i], args);
                    }
                }
            };

            ViewRouter = function (domain, provider) {
                this.domain = domain;
                this.provider = provider;
            };

            ViewRouter.prototype.when = function (path, fn) {

                var routingMethods = createRoutingMethods(this.domain);
                if (typeof (fn) === 'function')
                    fn(routingMethods);

                var route = routingMethods.get();
                this.provider.when(path, route);
            };

            ViewRouter.prototype.otherwise = function (fn) {

                var routingMethods = createRoutingMethods(this.domain);
                if (typeof (fn) === 'function')
                    fn(routingMethods);

                var route = routingMethods.get();
                this.provider.otherwise(route);
            };

            return ViewRouter;

        })(jsnbt.ViewRouter);

        return jsnbt;

    })(jsnbt || {});

})();