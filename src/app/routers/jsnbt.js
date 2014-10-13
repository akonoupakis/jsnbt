var app = require('../app.js');
var error = require('../error.js');
var jsnbt = require('../jsnbt.js');
var json = require('../utils/json.js');

module.exports = function () {

    return {
        route: function (ctx, next) {
            if (ctx.uri.path === '/jsnbt.js' || ctx.uri.path === '/admin/jsnbt.js') {
                if (ctx.req.method !== 'GET') {
                    error.render(ctx, 405);
                }
                else {
                    try {
                        ctx.res.writeHead(200, { "Content-Type": "application/javascript" });

                        var jsnbtValue = ctx.uri.first === 'jsnbt.js' ? jsnbt.getClientData('public') : jsnbt.getClientData('admin');
                        ctx.res.write('var jsnbt = ' + json.stringify(jsnbtValue));
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