var app = require('../app.js');
var jsnbt = require('../jsnbt.js');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function () {

    return {
        canRoute: function (ctx) {
            return ctx.uri.first === 'jsnbt-pck';
        },

        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-pck') {
                if (ctx.method !== 'GET') {
                    ctx.error(405);
                }
                else if (ctx.uri.parts.length != 2) {
                    ctx.error(400);
                }
                else {
                    try {
                        ctx.writeHead(200, { "Content-Type": "application/json" });
                        ctx.write(JSON.stringify(jsnbt.getConfiguration(ctx.uri.last), null, app.dbg ? '\t' : ''));
                        ctx.end();
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