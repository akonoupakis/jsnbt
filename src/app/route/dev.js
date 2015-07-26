var DevRouter = function (server) {

    var logger = require('../logger.js')(this);

    return {

        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-dev' && server.app.dbg && ctx.uri.parts.length > 1) {
                
                var serviceName = ctx.uri.parts[1];

                var service = null;
                try {
                    service = require('../dev/' + serviceName + '.js')(server);
                }
                catch (e) { }

                if (service !== null && typeof (service.route) === 'function') {
                    service.route(ctx, next);
                }
                else {
                    next();
                }
            }
            else {
                next();
            }
        }

    };

};

module.exports = DevRouter;