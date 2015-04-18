var _ = require('underscore');

var RouterRouteProcessor = function (server, routeId) {

    var configRoute = _.find(server.jsnbt.routes, function (x) { return x.id === routeId; });

    var configRouteFn = configRoute !== undefined ? configRoute.fn : '';

    var moduleRouter = configRoute !== undefined ? _.first(_.filter(server.app.modules.all, function (x) {
        return x.public === true
            && x[configRouteFn] && _.isFunction(x[configRouteFn]);
    })) : undefined;

    var nextRouter = function (ctx) {
        ctx.error(404);
    };

    return moduleRouter ? {

        route: function (ctx) {
            var next = function () {
                return nextRouter(ctx);
            }

            moduleRouter[configRouteFn](ctx, next);
        }

    } : undefined;

};

module.exports = RouterRouteProcessor;