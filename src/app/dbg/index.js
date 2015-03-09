module.exports = {

    init: function (appplication) {
        // init here
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

    view: {

        prerender: function (ctx) {
            // change here the ctx.model and the ctx.tmpl before rendering
        },

        render: function (ctx) {
            // change here the ctx.html upon render
        }

    }
}