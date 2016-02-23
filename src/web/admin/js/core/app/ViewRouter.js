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