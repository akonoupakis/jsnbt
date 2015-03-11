var app = require('../../app.js');
var jsnbt = require('../../jsnbt.js');
var _ = require('underscore');

module.exports = function (domain) {
    
    var moduleRouter = _.first(_.filter(app.modules, function (x) {
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

            moduleRouter.routePointer(ctx, next);
        }
    } : undefined

};