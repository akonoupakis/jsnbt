var app = require('./app.js');
var fs = require('fs');
var jsnbt = require('./jsnbt.js');
var error = require('./error.js');
var pack = require('./package.js');
var cookies = require('cookies');
var _ = require('underscore');

_.str = require('underscore.string');

var stardardRouterNames = [

    './routers/base.js',
    './routers/api.js',
    './routers/jsnbt.js',
    './routers/package.js',
    './routers/upload.js',
    './routers/admin.js',
    './routers/public.js'
];

var routers = [];

for (var i = 0; i < stardardRouterNames.length; i++) {
    var router = require(stardardRouterNames[i])();
    routers.push(router);
}

routers.push({
    sync: false,
    route: function (ctx, next) {
        error.render(ctx, 404);
    }
});

module.exports = function () {
    return {
        process: function (req, res) {
            var ctx = require('./context.js')(req, res);
            var ignoredPaths = ['dashboard', 'dpd.js', '__resources', 'socket.io', 'favicon.ico', 'app-offline.htm', 'dpd'];

            var ignoredPathPrefixes = ['/css/', '/font/', '/img/', '/js/', '/tmpl/', '/admin/css/', '/admin/font/', '/admin/img/', '/admin/js/', '/admin/tmpl/'];

            var notFoundPaths = [];
            var templatePaths = _.pluck(jsnbt.templates, 'path');
            notFoundPaths = _.union(notFoundPaths, templatePaths);
            notFoundPaths = _.union(notFoundPaths, ['/error/', '/admin/error/']);

            var forbiddedPathPrefixes = [];

            var forbidRequest = false;
            for (var i = 0; i < forbiddedPathPrefixes.length; i++) {
                if (_.str.startsWith(ctx.uri.path, forbiddedPathPrefixes[i])) {
                    forbidRequest = true;
                    break;
                }
            }

            if (forbidRequest) {
                req._routed = true;
                error.render(ctx, 403);
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

                    if (processRequest) {
                        req._routed = true;

                        ctx.req.cookies = new cookies(ctx.req, ctx.res);

                        app.server.sessions.createSession(ctx.req.cookies.get('sid'), function (err, session) {
                            if (err) {
                                throw err;
                            } else {
                                ctx.req.cookies.set('sid', session.sid);
                                ctx.req.session = session;
                                ctx.session = session;
                                ctx.dpd = require('deployd/lib/internal-client').build(app.server, session, ctx.req.stack);
                                ctx.req.dpd = ctx.dpd;

                                var nextIndex = 0;
                                var next = function () {
                                    nextIndex++;
                                    var router = routers[nextIndex];
                                    router.route(ctx, next);
                                };

                                var first = _.first(routers);
                                first.route(ctx, next);
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