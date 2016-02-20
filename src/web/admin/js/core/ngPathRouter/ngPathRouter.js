(function (window, angular, undefined) {
    'use strict';

    var routes = {};

    var navigate = function (options, path, cb) {

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
            angular.forEach(routes, function (route) {
                if (!match && (params = switchRouteMatcher(path, route))) {
                    match = angular.extend(route, {
                        params: angular.extend({}, search, params),
                        pathParams: params
                    });
                }
            });

            vcb(null, match || routes[null] && angular.extend(routes[null], { params: {}, pathParams: {} }));
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
                    commitedRoute.path = path;
                    cb(commitedErr, commitedRoute);
                });
            }
            else {
                cb(null, null)
            }
        });

    };


    var Route = function (options) {
        this.current = undefined;
        this.options = options;

        this.events = {
            start: [],
            success: [],
            error: []
        };
    };

    Route.prototype.init = function () {
        var self = this;

        var path = this.options.path || '/';

        this.direction = '';

        self.trigger('start', []);
        navigate(this.options, path, function (err, route) {
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

        this.direction = '';

        self.trigger('start', []);
        navigate(this.options, path, function (err, route) {
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

    Route.prototype.previous = function (path) {
        var self = this;

        this.direction = 'rtl';

        self.trigger('start', []);

        navigate(this.options, path, function (err, route) {
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

    Route.prototype.next = function (path) {
        var self = this;

        this.direction = 'ltr';
        
        self.trigger('start', []);
        navigate(this.options, path, function (err, route) {
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

    Route.prototype.reload = function () {
        var self = this;

        this.direction = '';

        self.trigger('start', []);
        navigate(this.options, this.current ? this.current.path : '/', function (err, route) {
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
    
    var $routesProvider = function () {

        this.$get = [function () {

            return {
             
            }

        }];
    };

    var $routerProvider = function () {

        function pathRegExp(path, opts) {
            var insensitive = true, //opts.caseInsensitiveMatch,
                ret = {
                    originalPath: path,
                    regexp: path
                },
                keys = ret.keys = [];

            path = path
              .replace(/([().])/g, '\\$1')
              .replace(/(\/)?:(\w+)([\?\*])?/g, function (_, slash, key, option) {
                  var optional = option === '?' ? option : null;
                  var star = option === '*' ? option : null;
                  keys.push({ name: key, optional: !!optional });
                  slash = slash || '';
                  return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (star && '(.+?)' || '([^/]+)')
                    + (optional || '')
                    + ')'
                    + (optional || '');
              })
              .replace(/([\/$\*])/g, '\\$1');

            ret.regexp = new RegExp('^' + path + '$', insensitive ? 'i' : '');
            return ret;
        }

        this.when = function (path, route) {
            var routeCopy = angular.copy(route);

            routes[path] = angular.extend(
            routeCopy,
            path && pathRegExp(path, routeCopy)
          );

            if (path) {
                var redirectPath = (path[path.length - 1] == '/')
                      ? path.substr(0, path.length - 1)
                      : path + '/';

                routes[redirectPath] = angular.extend(
                  { redirectTo: path },
                  pathRegExp(redirectPath, routeCopy)
                );
            }

            return this;
        };

        this.otherwise = function (params) {
            if (typeof params === 'string') {
                params = { redirectTo: params };
            }
            this.when(null, params);
            return this;
        };

        this.$get = ['$routes', function ($routes) {

            return {

                create: function (name, options) {
                    if ($routes[name])
                        throw new Error('route name already exists: ' + name);

                    $routes[name] = new Route(options);
                    return $routes[name];
                },

                get: function (name) {
                    if (!$routes[name])
                        throw new Error('route name not found: ' + name);

                    return $routes[name];
                },

                dispose: function (name) {
                    delete $routes[name];
                }

            }

        }];

    };


    routerViewFactory.$inject = ['$animate', '$location', '$router'];
    function routerViewFactory($animate, $location, $router) {
        return {
            restrict: 'E',
            terminal: true,
            priority: 400,
            replace: true,
            transclude: 'element',
            link: function (scope, $element, attr, ctrl, $transclude) {

                scope.$watch(attr.routeId, function (routeId) {
                    
                    var scopeRoute = $router.get(routeId);
                    
                    var currentScope,
                        currentElement,
                        previousLeaveAnimation;

                    scopeRoute.on('success', function (route) {
                        if (route)
                            update(route);
                        else
                            cleanupLastView();
                    });

                    scopeRoute.init();

                    function cleanupLastView() {
                        if (previousLeaveAnimation) {
                            $animate.cancel(previousLeaveAnimation);
                            previousLeaveAnimation = null;
                        }

                        if (currentScope) {
                            currentScope.$destroy();
                            currentScope = null;
                        }
                        if (currentElement) {
                            if (scopeRoute.direction === 'ltr')
                                $animate.addClass(currentElement, 'animate-next');
                            else if (scopeRoute.direction === 'rtl')
                                $animate.addClass(currentElement, 'animate-prev');

                            previousLeaveAnimation = $animate.leave(currentElement);
                            previousLeaveAnimation.then(function () {
                                previousLeaveAnimation = null;

                                if (scopeRoute.direction === 'ltr')
                                    $animate.removeClass(currentElement, 'animate-next');
                                else if (scopeRoute.direction === 'rtl')
                                    $animate.removeClass(currentElement, 'animate-prev');
                            });
                            currentElement = null;
                        }
                    }

                    function update(route) {
                        var templateUrl = route.baseTemplate || route.template;
                        if (templateUrl) {
                            var newScope = scope.$new();

                            var clone = $transclude(newScope, function (clone) {

                                if (scopeRoute.direction === 'ltr')
                                    $animate.addClass(clone, 'animate-next');
                                else if (scopeRoute.direction === 'rtl')
                                    $animate.addClass(clone, 'animate-prev');

                                $animate.enter(clone, null, currentElement || $element).then(function onNgViewEnter() {
                                    if (scopeRoute.direction === 'ltr')
                                        $animate.removeClass(clone, 'animate-next');
                                    else if (scopeRoute.direction === 'rtl')
                                        $animate.removeClass(clone, 'animate-prev');
                                });

                                cleanupLastView();
                            });

                            currentElement = clone;
                            currentScope = newScope;
                        } else {
                            cleanupLastView();
                        }
                    }

                });
                
            }
        };
    }

    routerViewFillContentFactory.$inject = ['$compile', '$controller', '$router'];
    function routerViewFillContentFactory($compile, $controller, $router) {
        return {
            restrict: 'E',
            priority: -400,
            replace: true,
            link: function (scope, $element, attr) {
                
                scope.$watch(attr.routeId, function (routeId) {

                    var scopeRoute = $router.get(routeId);

                    if (_.isObject(scopeRoute) && _.isObject(scopeRoute.current)) {
                        if (_.isObject(scopeRoute.current.scope))
                            for (var scopeProperty in scopeRoute.current.scope)
                                scope[scopeProperty] = scopeRoute.current.scope[scopeProperty];

                        scope.domain = scopeRoute.current.domain;
                        scope.section = scopeRoute.current.section;
                    }

                    scope.viewTemplate = scopeRoute.current.baseTemplate || scopeRoute.current.template;

                    $element.html('<div ng-include="viewTemplate"></div>');

                    var link = $compile($element.contents());

                    var controller = $controller(scopeRoute.current.controller, { $scope: scope });
                    $element.data('$ngControllerController', controller);

                    link(scope);

                });
            },
            template: '<div></div>'
        };
    }

    angular.module('ngPathRouter', ['ng'])
        .provider('$routes', $routesProvider)
        .provider('$router', $routerProvider)
        .directive('routerView', routerViewFactory)
        .directive('routerView', routerViewFillContentFactory);


})(window, window.angular);
