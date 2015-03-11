var app = require('../../app.js');
var jsnbt = require('../../jsnbt.js');
var _ = require('underscore');

module.exports = function (domain) {
    
    var moduleRouter = _.first(_.filter(app.modules, function (x) {
        return x.domain === domain
            && x.routeApi && _.isFunction(x.routeApi);
    }));

    var nextRouter = function (ctx) {
        ctx.error(404);
    };

    return moduleRouter ? {

        route: function (ctx, serviceName, fnName, fields, files) {
            var next = function () {
                return nextRouter(ctx);
            }

            moduleRouter.routeApi(ctx, serviceName, fnName, fields, files, next);
        }

    } : undefined

};