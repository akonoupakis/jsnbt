var app = require('../app.js');
var auth = require('../auth.js');
var jsnbt = require('../jsnbt.js');
var crawler = require('../crawler.js');
var jsuri = require('jsuri');
var _ = require('underscore');

_.str = require('underscore.string');

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
            if (ctx.node)
                ctx.render();
            else
                ctx.error(404);
        }
    });
    
    return {
        route: function (ctx, next) {
            if (ctx.uri.path === '/') {
                try {
                    var node = require('../node.js')(ctx.dpd);

                    node.resolveUrl(ctx.uri.url, function (resolved) {
                        if (resolved && resolved.page && resolved.isActive() && resolved.isPublished()) {
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
                                            if (settingNode && settingNode.data && settingNode.data.restricted && settingNode.data.loginpage) {
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
                                    ctx.language = jsnbt.localization ? resolved.language || 'en' : jsnbt.locale;
                                    ctx.template = resolved.template || '';
                                    ctx.meta = resolved.page.meta || {};
                                    ctx.uri.scheme = resolved.page.secure === true ? 'https' : 'http';

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
                                        ctx.render();
                                    }
                                }
                            }
                        }
                        else {
                            next();
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