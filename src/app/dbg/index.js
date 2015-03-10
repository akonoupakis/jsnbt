var app = null;

module.exports = {

    init: function (application) {
        app = application;
    },

    getConfig: function () {
        return require('./config.js');
    },

    route: function (ctx, next) {
        // intercept the routing process here, or trigger the next router        

        if (ctx.uri.path === '/test')
            ctx.error(500, 'not implemented');
        else
            next();
    },

    routeSearch: function (ctx) {
        ctx.error(500, 'not implemented');
    },

    routeApi: function (ctx, fields) {
        if (ctx.uri.parts.length === 3) {
            var domain = ctx.uri.parts[1];

            try {
                ctx.res.writeHead(200, { "Content-Type": "application/json" });
                ctx.res.write(JSON.stringify({ d: fields }, null, app.dbg ? '\t' : ''));
                ctx.res.end();
            }
            catch (err) {
                ctx.res.writeHead(500, { "Content-Type": "application/text" });
                ctx.res.write(err.toString());
                ctx.res.end();
            }
        }
        else {
            ctx.res.writeHead(404, { "Content-Type": "application/json" });
            ctx.res.end();
        }
    },

    view: {

        prerender: function (ctx) {
            // change here the ctx.model and the ctx.tmpl before rendering
        },

        render: function (ctx) {
            // change here the ctx.html upon render
        }

    }
}