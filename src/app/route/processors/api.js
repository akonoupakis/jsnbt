var _ = require('underscore');

var ApiRouteProcessor = function (server, domain) {
    
    var moduleRouter = _.first(_.filter(server.app.modules.all, function (x) {
        return x.domain.toLowerCase() === domain.toLowerCase()
            && x.routeApi && _.isFunction(x.routeApi);
    }));

    var nextRouter = function (ctx) {
        ctx.status(404).send({
            404: 'Not Found'
        });
    };

    return moduleRouter ? {

        route: function (ctx, serviceName, fnName, fields, files) {
            var next = function () {
                return nextRouter(ctx);
            }

            moduleRouter.routeApi(server, ctx, serviceName, fnName, fields, files, next);
        }

    } : undefined

};

module.exports = ApiRouteProcessor;