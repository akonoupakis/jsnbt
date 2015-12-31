var express = require('express');
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

        self.server.sessions.createSession(ctx.req.cookies.get('sid'), function (err, session) {
            ctx.req.cookies.set('sid', session.data.id);

            if (err)
                return cb(err);

            ctx.session = session;

            if ((session.data && session.data.uid) && !session.user) {

                var store = server.db.createStore('users', false);
                ctx.timer.start('current user retrieval');
                store.get(function (x) {
                    x.query(session.data.uid);
                    x.single();
                }, function (uerr, user) {
                    if (uerr)
                        return cb(uerr);

                    ctx.timer.stop('current user retrieval');
                    if (user) {
                        session.user = user;
                    }
                    cb(null, ctx);
                });
            }
            else {
                cb(null, ctx);
            }
        });
        
    };

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
                router.route(ctx, next);
            });
        }
    });

    this.express.get('/jsnbt-db/users/me', function (req, res, next) {
        buildSession(new Context(self.server, req, res), function (err, context) {
            var router = new require('./route/user.js')(self.server);
            router.route(context, next);
        });
    });

    this.express.all('/jsnbt-db/:collection*', function (req, res, next) {
        buildSession(new Context(self.server, req, res), function (err, context) {
            var router = new require('./route/proxy.js')(self.server);
            router.route(context, next);
        });
    });

    this.express.all('/jsnbt-dev/*', function (req, res, next) {
        next();
    });
    
    this.express.all('/jsnbt-api/*', function (req, res, next) {
        next();
    });

    this.express.post('/jsnbt-upload*', function (req, res, next) {
        var context = new Context(self.server, req, res);
        var router = new require('./route/upload.js')(self.server);
        router.route(context, next);
    });

    this.express.get('/files/*', function (req, res, next) {
        if (ctx.uri.query.type) {
            var router = new require('./route/image.js')(self.server);
            router.route(context, next);
        }
        else {
            next();
        }
    });

    this.express.use(express.static(self.server.getPath('www/public')));
    
    this.express.get('*', function (req, res, next) {
        buildSession(new Context(self.server, req, res), function (err, context) {
            var siteRouter = new require('./route/site.js')(self.server);
            siteRouter.route(context, function () {
                var publicRouter = new require('./route/public.js')(self.server);
                publicRouter.route(context, next);
            });
        });
    });
};

module.exports = function (server) {
    return new Router(server, server.express);
};