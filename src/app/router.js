var fs = require('fs');
var _ = require('underscore');

_.str = require('underscore.string');

var routerNames = [
    './routing/home.js',
    './routing/api.js',
    './routing/image.js',
    './routing/jsnbt.js',
    './routing/dpd.js',
    './routing/dev.js',
    './routing/upload.js',
    './routing/admin.js',
    './routing/resource.js',
    './routing/site.js',
    './routing/public.js'
];

var getRouters = function (server) {
    var routers = [];

    for (var i = 0; i < routerNames.length; i++) {
        var router = require(routerNames[i])(server);
        routers.push(router);
    }

    routers.push({
        route: function (ctx, next) {
            console.log(111);
            ctx.error(404);
        }
    });

    return routers;
};

var Router = function(server, req, res) {

    var authMngr = require('./cms/authMngr.js')(server);

    var routers = getRouters(server);

    var logger = require('./logger.js')(this);

    var ignoredPaths = []; //['dashboard', 'dpd.js', '__resources', 'socket.io', 'favicon.ico', 'app-offline.htm', 'dpd'];

    var ignoredPathPrefixes = []; //['/css/', '/fonts/', '/img/', '/js/', '/tmpl/', '/tmp/', '/files/', '/admin/css/', '/admin/fonts/', '/admin/img/', '/admin/js/', '/admin/tmpl/'];

    var forbiddedPathPrefixes = [];

    var notFoundPaths = [];
    var templatePaths = _.pluck(server.app.config.templates, 'path');
    notFoundPaths = _.union(notFoundPaths, templatePaths);
    notFoundPaths = _.union(notFoundPaths, ['/tmp/', '/error/', '/admin/error/']);

    var formPaths = _.union(
        _.pluck(_.filter(server.app.config.templates, function (x) { return x.form !== undefined; }), 'form'),
        _.pluck(_.filter(server.app.config.lists, function (x) { return x.form !== undefined; }), 'form')
    );

    var checkForbidded = function (ctx, next) {
        
        var forbidRequest = false;
        for (var i = 0; i < forbiddedPathPrefixes.length; i++) {
            if (_.str.startsWith(ctx.uri.path, forbiddedPathPrefixes[i])) {
                forbidRequest = true;
                break;
            }
        }

        if (forbidRequest) {
            ctx.error(403);
        }
        else {
            next();
        }

    };

    var checkFound = function (ctx, next)
    {
        var foundUrl = _.filter(notFoundPaths, function (x) { return _.str.startsWith(ctx.uri.path, x); }).length === 0;
        if (foundUrl) {

            var processRequest = true;
            if (ignoredPaths.indexOf(ctx.uri.first) != -1)
                processRequest = false;

            if (processRequest) {
                if (_.filter(ignoredPathPrefixes, function (x) { return _.str.startsWith(ctx.uri.path, x); }).length > 0) {
                    processRequest = false;
                }
            }

            if (_.filter(formPaths, function (x) { return _.str.startsWith(ctx.uri.path, x); }).length > 0) {
                processRequest = true;
            }
            
            if (processRequest) {
                req._routed = true;

                next();
            }
        }
        else {
            ctx.error(404);
        }
    };

    var buildSession = function (ctx, next) {
        ctx.timer.start('session built');
        server.sessions.createSession(ctx.req.cookies.get('sid'), function (err, session) {
            ctx.timer.stop('session built');

            if (err) {
                logger.error(req.method, req.url, err);
                throw err;
            } else {

                ctx.session = session;

                ctx.timer.start('dpd internal client built');
                dpd = require('./internal-client.js').build(server, session, req.stack);
                ctx.timer.stop('dpd internal client built');

                ctx.dpd = dpd;

                if ((session.data && session.data.uid) && !session.user) {

                    ctx.timer.start('current user retrieval');
                    dpd.users.get(session.data.uid, function (user, err) {
                        ctx.timer.stop('current user retrieval');
                        if (user) {
                            session.user = user;
                            next(ctx);
                        }
                        else
                            throw new Error('user not found');
                    });
                }
                else {
                    next(ctx);
                }
            }
        });
    };

    var processRequest = function (ctx) {
        ctx.req.cookies.set('sid', ctx.session.sid);
        
        ctx.req.dpd = ctx.dpd;

        ctx.req.session = ctx.session;

        ctx.user = ctx.session.user;

        if (_.filter(formPaths, function (x) { return _.str.startsWith(ctx.uri.path, x); }).length > 0) {
            if (!(ctx.session.user && authMngr.isInRole(ctx.session.user, 'admin'))) {
                ctxInteral.error(404);
            }
            else {
                fs.readFile(server.getPath('www/public' + ctx.uri.path), function (readErr, readResults) {
                    if (readErr) {
                        ctx.error(500, readErr);
                    }
                    else {
                        ctx.writeHead(200, { 'Content-Type': 'text/html' });
                        ctx.write(readResults);
                        ctx.end();
                    }
                });
            }
        }
        else {
            var nextIndex = 0;
            var next = function () {
                nextIndex++;
                var router = routers[nextIndex];
                router.route(ctx, next);
            };

            var first = _.first(routers);
            first.route(ctx, next);
        }
    };

    return {

        process: function () {

            var ctx = require('./context.js')(server, req, res);

            checkForbidded(ctx, function () {
                checkFound(ctx, function () {
                    buildSession(ctx, function (session) {
                        processRequest(ctx);
                    });
                });
            });

        }

    };
};

module.exports = Router;