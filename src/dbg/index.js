var app = null;

module.exports = {

    domain: 'public',
    public: true,

    init: function (application) {
        app = application;
    },

    getConfig: function () {
        return require('./config.js');
    },

    getVersion: function () {
        return '0.0.0';
    },

    getBower: function () {
        return require('./bower.json');
    },

    route: function (server, ctx, next) {
        
        if (ctx.uri.first === 'dbg' && ctx.uri.parts.length === 3) {

            var taskService = ctx.uri.parts[1];
            var taskMethod = ctx.uri.parts[2];

            var service = undefined;

            try {
                service = require('./tests/' + taskService + '.js')(server);
            }
            catch (err) {
                ctx.error(404);
            }

            if (service && typeof (service[taskMethod]) === 'function') {
                service[taskMethod](ctx, next);
            }
            else {
                ctx.error(404);
            }
        }
        else {
            next();
        }
    },

    routeSearch: function (server, ctx, next) {

        var notimp = true;

        if (notimp) {
            ctx.error(500, 'not implemented');
        }
        else {
            next();
        }

    },

    routeApi: function (server, ctx, serviceName, fnName, fields, files, next) {

        var service = null;
        try {
            service = require('./api/' + serviceName + '.js')(server);
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

        preparse: function (server, ctx, preparsingContext) {
            // change here the preparsingContext.model and the preparsingContext.tmpl before rendering
        },

        postparse: function (server, ctx, postparsingContext) {
            // change here the postparsingContext.html upon render
        }

    }
}