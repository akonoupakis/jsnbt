var app = require('./app.js');
var dpdSync = require('dpd-sync');
var fs = require('fs');
var error = require('./error.js');
var pack = require('./package.js');
var _ = require('underscore');

_.str = require('underscore.string');

var stardardRouterNames = [

    './routers/base.js',
    './routers/session.js',
    './routers/cache.js',
    './routers/service.js',
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

            var ignoredPathPrefixes = ['/css/', '/font/', '/img/', '/js/', '/tmpl/partial/', '/tmpl/spec/', '/admin/css/', '/admin/font/', '/admin/img/', '/admin/js/', '/admin/tmpl/partial/', '/admin/tmpl/spec/'];

            var forbiddedPathPrefixes = ['/tmpl/view/', '/tmpl/error/', '/admin/tmpl/view/', '/admin/tmpl/error/'];

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
                var processRequest = true;
                if (ignoredPaths.indexOf(ctx.uri.first) != -1)
                    processRequest = false;

                if (processRequest) {
                    for (var ii = 0; ii < ignoredPathPrefixes.length; ii++) {
                        if (_.str.startsWith(ctx.uri.path, ignoredPathPrefixes[ii])) {
                            processRequest = false;
                            break;
                        }
                    }
                }

                if (processRequest) {
                    var nextIndex = 0;
                    var next = function () {
                        nextIndex++;
                        var router = routers[nextIndex];
                        if (router.sync === true) { dpdSync.wrap(router.route, ctx, next); } else { router.route(ctx, next); }
                    };

                    var first = _.first(routers);
                    if (first.sync === true) { dpdSync.wrap(first.route, ctx, next); } else { first.route(ctx, next); }
                    req._routed = true;
                }
            }
        }
    };
};