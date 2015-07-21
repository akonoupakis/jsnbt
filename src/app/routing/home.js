var _ = require('underscore');
_.str = require('underscore.string');

var HomeRouter = function (server) {

    var logger = require('../logger.js')(this);
    var authMngr = require('../cms/authMngr.js')(server);

    var process = function (ctx, resolved, inherited) {

        if (ctx.restricted) {
            ctx.error(401);
        }
        else {
            ctx.node = resolved.page || {};
            ctx.pointer = resolved.pointer || {};
            ctx.inherited = inherited;
            ctx.layout = ctx.inherited.layout || '';
            ctx.language = server.app.localization.enabled ? resolved.language || server.app.localization.locale : server.app.localization.locale;
            ctx.template = resolved.template || '';

            ctx.meta = {};
            if (resolved.page.meta && resolved.page.meta[ctx.language])
                ctx.meta = resolved.page.meta[ctx.language] || {};

            ctx.uri.scheme = resolved.page.secure === true ? 'https' : 'http';

            if (_.filter((ctx.inherited.roles || []), function (x) { return x !== 'public' }).length > 0) {
                ctx.robots.noindex = true;
                ctx.robots.nofollow = true;
            }
            else {
                var robots = ctx.inherited.robots || [];
                _.each(robots, function (robot) {
                    if (ctx.robots[robot] !== undefined)
                        ctx.robots[robot] = true;
                });
            }

            if (resolved.pointer) {
                var pointerRouter = require('./processors/pointer.js')(server, resolved.pointer.pointer.domain);
                if (pointerRouter) {
                    pointerRouter.route(ctx);
                }
                else {
                    if (ctx.node) {
                        ctx.view();
                    }
                    else {
                        ctx.error(404);
                    }
                }
            }
            else if (resolved.route) {
                ctx.url = resolved.url;

                var routeRouter = require('./processors/router.js')(server, resolved.route);
                if (routeRouter) {
                    routeRouter.route(ctx);
                }
                else {
                    ctx.error(500, 'custom route not found in public module: ' + resolved.route);
                }
            }
            else {
                ctx.debug('node rendering: ' + resolved.page.id);
                ctx.view();
            }
        }

    };

    return {

        route: function (ctx, next) {
            if (ctx.uri.path === '/') {
                
                try {
                    var node = require('../cms/nodeMngr.js')(server, ctx.db);
                    
                    ctx.timer.start('node retrieval');

                    node.resolveUrl(ctx.uri.url, function (resolved) {
                        ctx.timer.stop('node retrieval');

                        if (resolved && resolved.page)
                            ctx.debug('node found: ' + resolved.page.id);

                        if (resolved && resolved.page && resolved.isActive()) {
                            
                            var inherited = resolved.getInheritedProperties();

                            if (!ctx.restricted) {
                                if (!authMngr.isInRole(ctx.user, (inherited.roles || []))) {
                                    ctx.restricted = true;
                                }
                            }

                            if (server.app.modules.public && typeof (server.app.modules.public.routeNode) === 'function') {
                                server.app.modules.public.routeNode(server, ctx, resolved, function () {
                                    process(ctx, resolved, inherited);
                                });
                            }
                            else {
                                process(ctx, resolved, inherited);
                            }
                        }
                        else {
                            ctx.debug('node inactive: ' + resolved.page.id);
                            ctx.error(404);
                        }
                    });
                }
                catch (err) {
                    logger.error(ctx.req.method, ctx.req.url, err);
                    ctx.error(500, err);
                }
            }
            else {
                next();
            }
        }

    };

};

module.exports = HomeRouter;