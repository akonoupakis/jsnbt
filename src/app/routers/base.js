var app = require('../app.js');
var dpdSync = require('dpd-sync');
var error = require('../error.js');
var view = require('../view.js');
var auth = require('../auth.js');
var node = require('../node.js');
var _ = require('underscore');

module.exports = function () {

    var addonRouters = [];
    for (var i = 0; i < app.packages.length; i++) {
        var pck = app.packages[i];
        if (typeof (pck.route) === 'function') {
            addonRouters.push(pck);
        }
    }

    addonRouters.push({
        route: function (ctx, next) {
            error.render(ctx, 404);
        }
    });

    return {
        sync: true,
        route: function (ctx, next) {
            if (ctx.uri.path === '/') {
                try {

                    var resolved = node.getNodeUrl(ctx.uri.url);
                    if (resolved) {
                        //var restricted = true;
                        //_.each(resolved.node.permissions, function (role) {
                        //    if (auth.isInRole(ctx.req.session.user, role)) {
                        //        restricted = false;
                        //    }
                        //});

                        //if (restricted) {
                        //    error.render(ctx, 401, 'Access denied');
                        //}
                        //else {
                            //var session = app.session.start(ctx.req, ctx.res);
                            //session.set('language', resolved.language);

                            ctx.node = resolved.node || {};
                            ctx.pointer = resolved.pointer || {};
                            ctx.language = resolved.language || 'en';
                            ctx.view = resolved.view || '';
                            ctx.meta = resolved.node.meta || {};
                            ctx.uri.scheme = resolved.node.secure === true ? 'https' : 'http';

                            if (resolved.pointer) {
                                var nextIndex = 0;
                                var nextInternal = function () {
                                    nextIndex++;
                                    var router = addonRouters[nextIndex];
                                    router.route(ctx, nextInternal);
                                };

                                var first = _.first(addonRouters);
                                first.route(ctx, nextInternal);
                            }
                            else {    
                                view.render(ctx);
                            }
                        //}
                    }
                    else {
                        next();
                    }                    
                }
                catch (err) {
                    app.logger.error(err);
                    error.render(ctx, 500, err.toString());
                }
            }
            else {
                next();
            }
        }
    };
};