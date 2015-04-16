var app = require('../app.js');

var FileApi = function (server) {

    var authMngr = require('../cms/authMngr.js')(server);
    var fileMngr = require('../cms/fileMngr.js')(server);

    return {

        get: function (ctx, fields) {
            if (!authMngr.isInRole(ctx.user, 'admin'))
                return null;

            try {
                var result = fileMngr.get(fields);
                ctx.json(result);
            }
            catch (ex) {
                ctx.error(500, ex, false);
            }
        },

        delete: function (ctx, fields) {
            if (!authMngr.isInRole(ctx.user, 'admin'))
                return null;

            try {
                var result = fileMngr.delete(fields);
                ctx.json(result);
            }
            catch (ex) {
                ctx.error(500, ex, false);
            }
        },

        create: function (ctx, fields) {
            if (!authMngr.isInRole(ctx.user, 'admin'))
                return null;

            try {
                var result = fileMngr.create(fields);
                ctx.json(result);
            }
            catch (ex) {
                ctx.error(500, ex, false);
            }
        },

        move: function (ctx, fields) {
            if (!authMngr.isInRole(ctx.user, 'admin'))
                return null;

            try {
                var result = fileMngr.move(fields);
            }
            catch (ex) {
                ctx.error(500, ex, false);
            }
        }

    };

};

module.exports = FileApi;