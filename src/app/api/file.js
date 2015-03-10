var app = require('../app.js');
var auth = require('../auth.js');
var file = require('../file.js');

module.exports = {
    
    get: function (ctx, fields) {
        if (!auth.isInRole(ctx.req.session.user, 'admin'))
            return null;

        var result = file.get(fields);

        ctx.res.writeHead(200, { "Content-Type": "application/json" });
        ctx.res.write(JSON.stringify({ d: result }, null, app.dbg ? '\t' : ''));
        ctx.res.end();
    },

    delete: function (ctx, fields) {
        if (!auth.isInRole(ctx.req.session.user, 'admin'))
            return null;

        var result = file.delete(fields);

        ctx.res.writeHead(200, { "Content-Type": "application/json" });
        ctx.res.write(JSON.stringify({ d: result }, null, app.dbg ? '\t' : ''));
        ctx.res.end();
    },

    create: function (ctx, fields) {
        if (!auth.isInRole(ctx.req.session.user, 'admin'))
            return null;

        var result = file.create(fields);

        ctx.res.writeHead(200, { "Content-Type": "application/json" });
        ctx.res.write(JSON.stringify({ d: result }, null, app.dbg ? '\t' : ''));
        ctx.res.end();
    },

    move: function (ctx, fields) {
        if (!auth.isInRole(ctx.req.session.user, 'admin'))
            return null;

        var result = file.move(fields);

        ctx.res.writeHead(200, { "Content-Type": "application/json" });
        ctx.res.write(JSON.stringify({ d: result }, null, app.dbg ? '\t' : ''));
        ctx.res.end();
    }

};