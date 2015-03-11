var app = require('../app.js');
var _ = require('underscore');

module.exports = function () {
  
    return {
        canRoute: function (ctx) {
            var moduleRouter = _.find(app.modules, function (x) {
                return x.public === true && x.route && _.isFunction(x.route);
            });

            return moduleRouter !== undefined;
        },
        
        route: function (ctx, next) {
            var moduleRouter = _.find(app.modules, function (x) {
                return x.public === true && x.route && _.isFunction(x.route);
            });

            if (moduleRouter) {
                moduleRouter.route(ctx, next);
            }
            else {
                next();
            }
        }
    };
};