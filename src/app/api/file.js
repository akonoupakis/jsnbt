var FileApi = function (server) {
    this.server = server;
};

FileApi.prototype.get = function (ctx, fields) {
    var logger = this.server.getLogger();

    var authMngr = require('../cms/authMngr.js')(this.server);

    if (!authMngr.isInRole(ctx.req.session.user, 'admin')) 
        return ctx.status(401).send('Access Denied');
        
    var paths = fields.path ? fields.path : fields.paths;
    var fileMngr = require('../cms/fileMngr.js')(this.server);
    fileMngr.get(paths, function (err, result) {
        if (err) {
            logger.error(err);
            return ctx.error(err);
        }

        ctx.send(result);
    });
};

FileApi.prototype.delete = function (ctx, fields) {
    var logger = this.server.getLogger();
    var authMngr = require('../cms/authMngr.js')(this.server);

    if (!authMngr.isInRole(ctx.req.session.user, 'admin'))
        return ctx.status(401).send('Access Denied');

    var fileMngr = require('../cms/fileMngr.js')(this.server);
    fileMngr.delete(fields.path, function (err, result) { 
        if (err) {
            logger.error(err);
            return ctx.error(err);
        }

        ctx.send(result);
    });
};

FileApi.prototype.create = function (ctx, fields) {
    var logger = this.server.getLogger();
    var authMngr = require('../cms/authMngr.js')(this.server);

    if (!authMngr.isInRole(ctx.req.session.user, 'admin'))
        return ctx.status(401).send('Access Denied');

    var fileMngr = require('../cms/fileMngr.js')(this.server);
    fileMngr.create(fields.path, fields.name, function (err, result) { 
        if (err) {
            logger.error(err);
            return ctx.error(err);
        }
        
        ctx.send(result);
    });
};

FileApi.prototype.move = function (ctx, fields) {
    var logger = this.server.getLogger();
    var authMngr = require('../cms/authMngr.js')(this.server);

    if (!authMngr.isInRole(ctx.req.session.user, 'admin'))
        return ctx.status(401).send('Access Denied');

    var fileMngr = require('../cms/fileMngr.js')(this.server);
    fileMngr.move(fields.from, fields.to, function (err, result) {
        if (err) {
            logger.error(err);
            return ctx.error(err);
        }

        ctx.send(result);
    });
};

module.exports = function (server) {
    return new FileApi(server);
};