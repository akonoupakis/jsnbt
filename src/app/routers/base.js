var app = require('../app.js');
var auth = require('../auth.js');
var jsnbt = require('../jsnbt.js');
var crawler = require('../crawler.js');
var jsuri = require('jsuri');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function () {
    
    return {
        route: function (ctx, next) {
            if (ctx.uri.path === '/') {
                try {
                    var node = require('../node.js')(ctx.dpd);
                    
                    node.resolveUrl(ctx.uri.url, function (resolved) {
                        if (resolved && resolved.page && resolved.isActive()) {
                            var restricted = false;

                            var prerender = false;
                            if (ctx.req.headers["user-agent"]) {
                                var userAgent = ctx.req.headers["user-agent"];
                                var searchbots = ['google', 'googlebot', 'yahoo', 'baiduspider', 'bingbot', 'yandexbot', 'teoma'];
                                _.each(searchbots, function (searchbot) {
                                    if (userAgent.toLowerCase().indexOf(searchbot) !== -1) {
                                        prerender = true;
                                        return false;
                                    }
                                });
                            }

                            if (!prerender)
                                if (ctx.uri.query.prerender)
                                    if (auth.isInRole(ctx.req.session.user, 'admin')) 
                                        prerender = true;

                            if (!restricted && jsnbt.restricted) {
                                if (!auth.isInRole(ctx.req.session.user, resolved.getPermissions())) {
                                    restricted = true;
                                }
                            }

                            if (restricted) {
                                if (prerender) {
                                    ctx.error(401);
                                }
                                else {
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
                            }
                            else {
                                if (prerender) {
                                    var targetUrl = new jsuri(_.str.rtrim(ctx.uri.getBaseHref(), '/') + ctx.uri.url).deleteQueryParam('prerender').toString();
                                    
                                    crawler.crawl(targetUrl, function (crawlErr, crawlData) {
                                        if (crawlErr) {
                                            ctx.error(500, crawlErr);
                                        }
                                        else {
                                            ctx.res.writeHead(200, { "Content-Type": "text/html" });
                                            ctx.res.write(crawlData);
                                            ctx.res.end();
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
                                    
                                    var applyTemplate = function (ctxInternal) {
                                        var installedTemplate = _.first(_.filter(jsnbt.templates, function (x) { return x.id === ctxInternal.template; }));
                                        if (installedTemplate) {
                                            ctxInternal.template = installedTemplate.html;
                                        }
                                        else {
                                            ctxInternal.error(500, 'template not installed: ' + ctxInternal.template);
                                        }
                                    };
                                    
                                    if (resolved.pointer) {
                                        var moduleRouter = _.first(_.filter(jsnbt.modules, function (x) {
                                            return x.domain === resolved.pointer.pointer.domain
                                                && x.index.point && _.isFunction(x.index.point);
                                        }));

                                        if (moduleRouter) {
                                            applyTemplate(ctx);
                                            moduleRouter.index.point(ctx);
                                        }
                                        else {
                                            if (ctx.node) {
                                                applyTemplate(ctx);                                                
                                                ctx.render();
                                            }
                                            else {
                                                ctx.error(404);
                                            }
                                        }
                                    }
                                    else if (resolved.route) {
                                        var configRoute = _.find(jsnbt.routes, function (x) { return x.id === resolved.route; });

                                        var configRouteFn = configRoute !== undefined ? configRoute.fn : '';

                                        var moduleRouter = configRoute !== undefined ? _.first(_.filter(jsnbt.modules, function (x) {
                                            return x.public === true
                                                && x.index[configRouteFn] && _.isFunction(x.index[configRouteFn]);
                                        })) : undefined;

                                        if (moduleRouter) {
                                            applyTemplate(ctx);
                                            moduleRouter.index[configRouteFn](ctx);
                                        }
                                        else {
                                            ctx.error(500, 'custom route not found in public module: ' + resolved.route);
                                        }
                                    }
                                    else {
                                        applyTemplate(ctx);
                                        ctx.render();
                                    }
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