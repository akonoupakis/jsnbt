var app = require('../../app.js');
var jsnbt = require('../../jsnbt.js');
var _ = require('underscore');

module.exports = function (routeId) {
    
    var configRoute = _.find(jsnbt.routes, function (x) { return x.id === routeId; });

    var configRouteFn = configRoute !== undefined ? configRoute.fn : '';

    var moduleRouter = configRoute !== undefined ? _.first(_.filter(app.modules, function (x) {
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