﻿var app = null;

module.exports = {

    init: function (application) {
        app = application;
    },

    getConfig: function () {
        return require('./config.js');
    },

    getBower: function () {
        return require('./bower.json');
    },

    route: function (ctx, next) {
        
        if (ctx.uri.first === 'dbg' && ctx.uri.parts.length === 3) {

            var taskService = ctx.uri.parts[1];
            var taskMethod = ctx.uri.parts[2];

            var service = undefined;

            try {
                service = require('./tests/' + taskService + '.js')();
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