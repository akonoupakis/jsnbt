var express = require('express');
var path = require('path');
var Context = require('./context.js');
var _ = require('underscore');

_.str = require('underscore.string');

var Router = function(server, express) {
    this.server = server;
    this.express = express;
};

Router.prototype.start = function () {
    var self = this;

    var buildSession = function (ctx, cb) {

        if (!ctx.req.sessionID)
            return cb(null, ctx);

        var session = ctx.req.session;
        if (session.uid && !session.user) {

            var store = self.server.db.createStore('users', ctx.req, ctx.res, true);
            ctx.timer.start('current user retrieval');
            store.get(function (x) {
                x.query(session.uid);
                x.single();
            }, function (uerr, user) {
                if (uerr)
                    return cb(uerr);

                ctx.timer.stop('current user retrieval');
                if (user) {
                    delete user.password;
                    session.user = user;
                }
                else {
                    delete sssion.uid;
                }

                session.save(function () {
                    cb(null, ctx);
                });
            });

        }
        else {
            cb(null, ctx);
        }
    };
    
    var notFoundPaths = [];
    var templatePaths = _.pluck(self.server.app.config.templates, 'path');
    notFoundPaths = _.union(notFoundPaths, templatePaths);
    notFoundPaths = _.union(notFoundPaths, ['/error/', '/admin/error/']);

    var formPaths = _.map(_.union(
        _.pluck(_.filter(self.server.app.config.templates, function (x) { return x.form !== undefined; }), 'form'),
        _.pluck(_.filter(self.server.app.config.lists, function (x) { return x.form !== undefined; }), 'form')
    ), function (m) {
        return '/admin' + m;
    });

    this.express.get(formPaths, function (req, res, next) {
        res.status(403).send({
            403: 'Forbidded'
        });
    });

    this.express.get('/socket.io*', function (req, res, next) {
        return;
    });

    this.express.get('/admin', function (req, res, next) {
        var context = new Context(self.server, req, res);
        if (context.req.url.toLowerCase() === '/admin' || _.str.startsWith(context.req.url.toLowerCase(), '/admin#')) {
            if (_.str.startsWith(context.req.url.toLowerCase(), '/admin#'))
                context.redirect(context.req.url.replace(/\/admin#/, '/admin/#'));
            else
                context.redirect("/admin/");
        }
        else {
            buildSession(context, function (err, ctx) {
                var router = new require('./route/admin.js')(self.server);
                router.route(ctx, function () {
                    context.error(404);
                });
            });
        }
    });

    this.express.get('/jsnbt-db/users/me', function (req, res, next) {
        buildSession(new Context(self.server, req, res, 'json'), function (err, context) {
            var router = new require('./route/user.js')(self.server);
            router.route(context, function () {
                context.error(404);
            });
        });
    });

    this.express.all('/jsnbt-db/:collection*', function (req, res, next) {
        buildSession(new Context(self.server, req, res, 'json'), function (err, context) {
            var router = new require('./route/proxy.js')(self.server);
            router.route(context, function () {
                context.error(404);
            });
        });
    });

    this.express.all('/jsnbt-dev/:service/*', function (req, res, next) {
        if (self.server.app.dbg) {
            buildSession(new Context(self.server, req, res), function (err, context) {
                var router = new require('./route/dev.js')(self.server);
                router.route(context, req.params.service, function () {
                    context.error(404);
                });
            });
        }
        else {
            next();
        }
    });
    
    this.express.all('/jsnbt-api/:domain/:service/:method', function (req, res, next) {
        buildSession(new Context(self.server, req, res, 'json'), function (err, context) {
            var router = new require('./route/api.js')(self.server);
            router.route(context, req.params.domain, req.params.service, req.params.method, function () {
                context.error(404);
            });
        });
    });

    this.express.all('/jsnbt-upload*', function (req, res, next) {
        buildSession(new Context(self.server, req, res), function (err, context) {
            var router = new require('./route/upload.js')(self.server);
            router.route(context, function () {
                context.error(404);
            });
        });
    });

    this.express.get('/files/*', function (req, res, next) {
        var context = new Context(self.server, req, res);
        if (context.uri.query.type) {
            var imageFileExtension = path.extname(context.uri.path).toLowerCase();
            if (['.png', '.jpg', 'jpeg', 'gif', 'tiff'].indexOf(imageFileExtension) !== -1) {
                var router = new require('./route/image.js')(self.server);
                router.route(context, next);
            }
            else {
                next();
            }
        }
        else {
            next();
        }
    });

    this.express.use(express.static(self.server.getPath('www/public')));
    
    this.express.get('*', function (req, res, next) {
        var ctx = new Context(self.server, req, res, 'html');
        buildSession(ctx, function (err, context) {
            var siteRouter = new require('./route/site.js')(self.server);
            siteRouter.route(context, function () {
                var publicRouter = new require('./route/public.js')(self.server);
                publicRouter.route(context, function () {
                    context.error(404);
                });
            });
        });
    });
};

module.exports = function (server) {
    return new Router(server, server.express);
};