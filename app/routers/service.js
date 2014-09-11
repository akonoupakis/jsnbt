var app = require('../app.js');
var error = require('../error.js');

module.exports = function () {

    return {
        sync: true,
        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-service') {
                if (ctx.req.method !== 'GET') {
                    error.render(ctx, 405);
                }
                if (ctx.uri.parts.length != 2) {
                    error.render(ctx, 400);
                }
                else if (ctx.uri.query.fn === undefined) {
                    error.render(ctx, 400);
                }
                else {
                    try {
                        var serviceName = ctx.uri.parts[1];

                        var service = require('../services/' + serviceName + '.js');

                        var args = [];

                        for (var item in ctx.uri.query) {
                            if (item !== 'fn')
                                args.push(decodeURIComponent(ctx.uri.query[item]));
                        }

                        var serviceFn = service[ctx.uri.query.fn];

                        var node = serviceFn.apply(serviceFn, args);
                        ctx.res.writeHead(200, { "Content-Type": "application/json" });
                        ctx.res.write(JSON.stringify({ d: node }, null, '\t'));
                        ctx.res.end();
                    }
                    catch (err) {
                        app.logger.error(err);
                        error.render(ctx, 500, err.toString());
                    }
                }
            }
            else {
                next();
            }
        }
    };
};