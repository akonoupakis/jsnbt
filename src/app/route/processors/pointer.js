var _ = require('underscore');

var PointerRouterProcessor = function (server, domain) {
    var moduleRouter = _.first(_.filter(server.app.modules.rest, function (x) {
        return x.domain.toLowerCase() === domain.toLowerCase()
            && x.routePointer && _.isFunction(x.routePointer);
    }));

    var nextRouter = function (ctx) {
        ctx.error(404);
    };

    return moduleRouter ? {

        route: function (ctx) {
            var next = function () {
                return nextRouter(ctx);
            }

            moduleRouter.routePointer(server, ctx, next);
        }
    } : undefined
};

module.exports = PointerRouterProcessor;