(function () {
    "use strict";
    
    jsnbt = (function (jsnbt) {

        jsnbt.router = (function () {

            var defaultOptions = {
                controller: undefined,
                domain: undefined,
                section: undefined,
                scope: {
                    domain: undefined,
                    section: undefined,
                    prefix: ''
                }
            };

            var createRoutingMethods = function (domain) {

                var routingOptions = {};
                $.extend(true, routingOptions, defaultOptions, {
                    domain: domain,
                    scope: {
                        domain: domain
                    }
                });

                var routingMethods = {};

                routingMethods.controller = function (controller) {
                    routingOptions.controller = controller;
                };

                routingMethods.baseTemplate = function (baseTmpl) {
                    routingOptions.templateUrl = baseTmpl;
                };

                routingMethods.template = function (tmpl) {
                    if (!routingOptions.templateUrl)
                        routingOptions.templateUrl = tmpl;
                    else
                        routingOptions.tmpl = tmpl;
                };
                
                routingMethods.section = function (section) {
                    routingOptions.section = section;
                    routingOptions.scope.section = domain;
                };

                routingMethods.scope = function (scope) {
                    $.extend(true, routingOptions.scope, scope);
                };

                routingMethods.redirect = function (path) {
                    routingOptions.redirectTo = path;
                };

                routingMethods.get = function () {
                    if (routingOptions.tmpl)
                        routingOptions.scope.template = routingOptions.tmpl;

                    return routingOptions;
                };

                return routingMethods;

            };

            var router = function (domain, provider) {
                this.domain = domain;
                this.provider = provider;
            }

            router.prototype.when = function (path, fn) {
                
                var routingMethods = createRoutingMethods(this.domain);
                if (typeof (fn) === 'function')
                    fn(routingMethods);

                var options = routingMethods.get();
                this.provider.when(path, options);
            };

            router.prototype.otherwise = function (fn) {

                var routingMethods = createRoutingMethods(this.domain);
                if (typeof (fn) === 'function')
                    fn(routingMethods);

                var options = routingMethods.get();
                this.provider.otherwise(options);
            };

            return router;

        })(jsnbt.router || {});
        
        return jsnbt;

    })(jsnbt || {});

})();