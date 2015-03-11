var app = require('../app.js');
var auth = require('../auth.js');
var file = require('../file.js');

module.exports = {
    
    get: function (ctx, fields) {
        if (!auth.isInRole(ctx.user, 'admin'))
            return null;

        try {
            var result = file.get(fields);
            ctx.json(result);
        }
        catch (ex) {
            ctx.error(500, ex, false);
        }
    },

    delete: function (ctx, fields) {
        if (!auth.isInRole(ctx.user, 'admin'))
            return null;

        try {
            var result = file.delete(fields);
            ctx.json(result);
        }
        catch (ex) {
            ctx.error(500, ex, false);
        }
    },

    create: function (ctx, fields) {
        if (!auth.isInRole(ctx.user, 'admin'))
            return null;

        try {
            var result = file.create(fields);
            ctx.json(result);
        }
        catch (ex) {
            ctx.error(500, ex, false);
        }
    },

    move: function (ctx, fields) {
        if (!auth.isInRole(ctx.user, 'admin'))
            return null;

        try {
            var result = file.move(fields);
        }
        catch (ex) {
            ctx.error(500, ex, false);
        }
    }

};