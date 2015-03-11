var app = require('../app.js');
var jsnbt = require('../jsnbt.js');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function () {

    return {
        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-pck') {
                if (ctx.req.method !== 'GET') {
                    ctx.error(405);
                }
                else if (ctx.uri.parts.length != 2) {
                    ctx.error(400);
                }
                else {
                    try {
                        ctx.res.writeHead(200, { "Content-Type": "application/json" });
                        ctx.res.write(JSON.stringify(jsnbt.getConfiguration(ctx.uri.last), null, app.dbg ? '\t' : ''));
                        ctx.res.end();
                    }
                    catch (err) {
                        app.logger.error(err);
                        ctx.error(500, err);
                    }
                }
            }
            else {
                next();
            }
        }
    };
};