var app = require('../app.js');
var error = require('../error.js');

module.exports = function () {

    return {
        route: function (ctx, next) {

            if (ctx.uri.first === 'jsnbt-session') {
                if (ctx.req.method !== 'GET') {
                    error.render(ctx, 405);
                }
                else if (ctx.uri.parts.length != 2) {
                    error.render(ctx, 404);
                }
                else {
                    try {
                        var sessionKey = ctx.uri.last;

                        if (['language'].indexOf(sessionKey) == -1) {
                            error.render(ctx, 404);
                        }
                        else {
                            var session = app.session.start(ctx.req, ctx.res);

                            ctx.res.writeHead(200, { "Content-Type": "application/json" });
                            ctx.res.write(JSON.stringify({ d: session.get(sessionKey) }));
                            ctx.res.end();
                        }
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