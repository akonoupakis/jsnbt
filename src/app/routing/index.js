var app = require('../app.js');
var auth = require('../auth.js');
var jsnbt = require('../jsnbt.js');
var crawler = require('../crawl/phantom.js');
var jsuri = require('jsuri');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function () {
    
    return {
        canRoute: function (ctx) {
            return ctx.uri.path === '/';
        },

        route: function (ctx, next) {
            if (ctx.uri.path === '/') {
                try {
                    var node = require('../node.js')(ctx.dpd);
                    
                    node.resolveUrl(ctx.uri.url, function (resolved) {
                        if (resolved && resolved.page && resolved.isActive()) {
                            
                            if (!ctx.restricted && jsnbt.restricted) {
                                if (!auth.isInRole(ctx.user, resolved.getPermissions())) {
                                    ctx.restricted = true;
                                }
                            }

                            if (ctx.restricted) {
                                ctx.dpd.settings.get({ domain: 'core' }, function (settingNodes, settingNodesError) {
                                    if (settingNodesError) {
                                        ctx.error(500, settingNodesError);
                                    }
                                    else {
                                        var settingNode = _.first(settingNodes);
                                        if (settingNode && settingNode.data && settingNode.data.loginpage) {
                                            ctx.dpd.nodes.get(settingNode.data.loginpage, function (loginNode, loginNodeError) {
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
                                ctx.layout = resolved.getLayout();
                                ctx.language = jsnbt.localization ? resolved.language || 'en' : jsnbt.locale;
                                ctx.template = resolved.template || '';
                               
                                ctx.meta = {};
                                if (resolved.page.meta && resolved.page.meta[ctx.language])
                                    ctx.meta = resolved.page.meta[ctx.language] || {};

                                ctx.uri.scheme = resolved.page.secure === true ? 'https' : 'http';

                                if (_.filter(resolved.getPermissions(), function (x) { return x !== 'public' }).length > 0) {
                                    ctx.robots.noindex = true;
                                    ctx.robots.nofollow = true;
                                }
                                else {
                                    var robots = resolved.getRobots();
                                    _.each(robots, function (robot) {
                                        if (ctx.robots[robot] !== undefined)
                                            ctx.robots[robot] = true;
                                    });
                                }
                                    
                                if (resolved.pointer) {
                                    var pointerRouter = require('./processors/router.js')(resolved.pointer.pointer.domain);
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

                                    var routeRouter = require('./processors/router.js')(resolved.route);
                                    if (routeRouter) {
                                        routeRouter.route(ctx);
                                    }
                                    else {
                                        ctx.error(500, 'custom route not found in public module: ' + resolved.route);
                                    }
                                }
                                else {
                                    ctx.view();
                                }
                            }
                        }
                        else {
                            ctx.error(404);
                        }
                    });
                }
                catch (err) {
                    app.logger.error(err);
                    ctx.error(500, err);
                }
            }
            else {
                next();
            }
        }
    };
};