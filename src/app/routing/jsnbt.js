var app = require('../app.js');
var jsnbt = require('../jsnbt.js');

module.exports = function () {

    return {
        canRoute: function (ctx) {
            return ctx.uri.path === '/jsnbt.js' || ctx.uri.path === '/admin/jsnbt.js';
        },

        route: function (ctx, next) {
            if (ctx.uri.path === '/jsnbt.js' || ctx.uri.path === '/admin/jsnbt.js') {
                if (ctx.method !== 'GET') {
                    ctx.error(405);
                }
                else {
                    try {
                        ctx.writeHead(200, { "Content-Type": "application/javascript" });

                        var jsnbtValue = ctx.uri.first === 'jsnbt.js' ? jsnbt.getClientData('public') : jsnbt.getClientData('admin');
                        ctx.write('var jsnbt = ' + JSON.stringify(jsnbtValue, null, app.dbg ? '\t' : ''));
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