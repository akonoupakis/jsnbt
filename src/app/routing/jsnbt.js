var JsnbtRouter = function (server) {

    var logger = require('../logger.js')(this);

    return {

        route: function (ctx, next) {
            if (ctx.uri.path === '/jsnbt.js' || ctx.uri.path === '/admin/jsnbt.js') {
                if (ctx.method !== 'GET') {
                    ctx.error(405);
                }
                else {
                    try {
                        ctx.writeHead(200, { "Content-Type": "application/javascript" });

                        var jsnbtValue = ctx.uri.first === 'jsnbt.js' ? server.jsnbt.getClientData('public') : server.jsnbt.getClientData('admin');
                        ctx.write('var jsnbt = ' + JSON.stringify(jsnbtValue, null, server.app.dbg ? '\t' : ''));
                        ctx.end();
                    }
                    catch (err) {
                        logger.error(ctx.req.method, ctx.req.url, err);
                        ctx.error(500, err, 'application/text');
                    }
                }
            }
            else {
                next();
            }
        }

    };

};

module.exports = JsnbtRouter;