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

    routeSearch: function (ctx, next) {

        var notimp = true;

        if (notimp) {
            ctx.error(500, 'not implemented');
        }
        else {
            next();
        }

    },

    routeApi: function (ctx, serviceName, fnName, fields, files, next) {

        var service = null;
        try {
            service = require('./api/' + serviceName + '.js');
        }
        catch (e) { }

        if (service && typeof (service[fnName]) === 'function') {
            service[fnName](ctx, fields);
        }
        else {
            next();
        }

    },

    view: {

        preparse: function (ctx, preparsingContext) {
            // change here the preparsingContext.model and the preparsingContext.tmpl before rendering
        },

        postparse: function (ctx, postparsingContext) {
            // change here the postparsingContext.html upon render
        }

    }
}