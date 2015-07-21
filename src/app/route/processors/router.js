var _ = require('underscore');

var RouterRouteProcessor = function (server, routeId) {

    var configRoute = _.find(server.app.config.routes, function (x) { return x.id === routeId; });

    var configRouteFn = configRoute !== undefined ? configRoute.fn : '';

    var moduleRouter = server.app.modules.public && _.isFunction(server.app.modules.public[configRouteFn]) ? server.app.modules.public : undefined;

    var nextRouter = function (ctx) {
        ctx.error(404);
    };

    return moduleRouter ? {

        route: function (ctx) {
            var next = function () {
                return nextRouter(ctx);
            }

            moduleRouter[configRouteFn](server, ctx, next);
        }

    } : undefined;

};

module.exports = RouterRouteProcessor;