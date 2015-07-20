var _ = require('underscore');
_.str = require('underscore.string');

var HomeRouter = function (server) {

    var logger = require('../logger.js')(this);
    var authMngr = require('../cms/authMngr.js')(server);

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
                            
                            if (!ctx.restricted && server.app.restricted) {
                                if (!authMngr.isInRole(ctx.user, (inherited.roles || []))) {
                                    ctx.restricted = true;
                                }
                            }

                            if (ctx.restricted) {
                                ctx.db.settings.getCached({ domain: 'core' }, function (settingNodes, settingNodesError) {
                                    if (settingNodesError) {
                                        ctx.error(500, settingNodesError);
                                    }
                                    else {
                                        var settingNode = _.first(settingNodes);
                                        if (settingNode && settingNode.data && settingNode.data.loginpage) {
                                            ctx.db.nodes.get(settingNode.data.loginpage, function (loginNode, loginNodeError) {
                                                if (loginNodeError) {
                                                    ctx.error(500, loginNodeError);
                                                }
                                                else {
                                                    node.buildUrl(loginNode, function (loginUrlResult) {
                                                        var loginUrl = loginUrlResult[resolved.language];

                                                        if (loginUrl !== '') {
                                                            ctx.redirect(loginUrl);
                                                        }
                                                        else {
                                                            ctx.error(401);
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            ctx.error(401);
                                        }
                                    }
                                });
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