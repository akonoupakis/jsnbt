var app = require('./app.js');
var fs = require('fs');
var jsnbt = require('./jsnbt.js');
var auth = require('./auth.js');
var server = require('server-root');
var _ = require('underscore');

_.str = require('underscore.string');

var routerNames = [
    './routing/index.js',
    './routing/api.js',
    './routing/image.js',
    './routing/jsnbt.js',
    './routing/package.js',
    './routing/upload.js',
    './routing/admin.js',
    './routing/site.js',
    './routing/public.js'
];

var routers = [];

for (var i = 0; i < routerNames.length; i++) {
    var router = require(routerNames[i])();
    routers.push(router);
}

routers.push({
    route: function (ctx, next) {
        ctx.error(404);
    }
});

module.exports = function (server) {

    return {
        process: function (req, res) {
            var ctx = require('./context.js')(req, res);

            var ignoredPaths = ['dashboard', 'dpd.js', '__resources', 'socket.io', 'favicon.ico', 'app-offline.htm', 'dpd'];

            var ignoredPathPrefixes = ['/css/', '/font/', '/img/', '/js/', '/tmpl/', '/tmp/', '/files/', '/admin/css/', '/admin/font/', '/admin/img/', '/admin/js/', '/admin/tmpl/'];

            var notFoundPaths = [];
            var templatePaths = _.pluck(jsnbt.templates, 'path');
            notFoundPaths = _.union(notFoundPaths, templatePaths);
            notFoundPaths = _.union(notFoundPaths, ['/tmp/', '/error/', '/admin/error/']);

            var formPaths = _.union(
                _.pluck(_.filter(jsnbt.templates, function (x) { return x.form !== undefined; }), 'form'),
                _.pluck(_.filter(jsnbt.lists, function (x) { return x.form !== undefined; }), 'form')
            );

            var forbiddedPathPrefixes = [];

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
                    
                    if (!processRequest && ctx.uri.first === 'files') {
                        var imageRouter = require('./routing/image.js')();
                        processRequest = imageRouter.canRoute(ctx);
                    }
                    
                    if (processRequest) {
                        req._routed = true;
                        
                        var continueRequest = function (ctxInteral, reqInternal, resInternal, sessionInternal, dpdInternal) {

                            reqInternal.cookies.set('sid', sessionInternal.sid);
                            
                            reqInternal.dpd = dpdInternal;
                            ctxInteral.dpd = dpdInternal;

                            reqInternal.session = sessionInternal;
                            ctxInteral.session = sessionInternal;

                            ctxInteral.user = sessionInternal.user;
                            
                            if (_.filter(formPaths, function (x) { return _.str.startsWith(ctxInteral.uri.path, x); }).length > 0) {
                                if (!(sessionInternal.user && auth.isInRole(sessionInternal.user, 'admin'))) {
                                    ctxInteral.error(404);
                                }
                                else {
                                    fs.readFile(server.getPath(app.root + '/public' + ctxInteral.uri.path), function (readErr, readResults) {
                                        if (readErr) {
                                            ctxInteral.error(500, readErr);
                                        }
                                        else {
                                            ctxInteral.writeHead(200, { 'Content-Type': 'text/html' });
                                            ctxInteral.write(readResults);
                                            ctxInteral.end();
                                        }
                                    });
                                }
                            }
                            else {
                                var nextIndex = 0;
                                var next = function () {
                                    nextIndex++;
                                    var router = routers[nextIndex];
                                    router.route(ctxInteral, next);
                                };

                                var first = _.first(routers);
                                first.route(ctxInteral, next);
                            }
                        };

                        server.sessions.createSession(req.cookies.get('sid'), function (err, session) {

                            if (err) {
                                throw err;
                            } else {
                                
                                dpd = require('deployd/lib/internal-client').build(server, session, req.stack);
                                
                                if ((session.data && session.data.uid) && !session.user) {
                                    
                                    dpd.users.get(session.data.uid, function (user, err) {
                                        if (user) {
                                            session.user = user;
                                            continueRequest(ctx, req, res, session, dpd);
                                        }
                                        else
                                            throw new Error('user not found');
                                    });
                                }
                                else {
                                    continueRequest(ctx, req, res, session, dpd);
                                }
                            }
                        });
                    }
                }
                else {
                    ctx.error(404);
                }
            }
        }
    };
};