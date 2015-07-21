var path = require('path');
var send = require('send');
var url = require('url');
var _ = require('underscore');

_.str = require('underscore.string');
    
var PublicRouter = function (server) {

    var logger = require('../logger.js')(this);
    var authMngr = require('../cms/authMngr.js')(server);
        
    var process = function (ctx, resolved, inherited) {
        if (ctx.restricted) {
            ctx.error(401, 'Access denied');
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
                var pointerRouter = require('./processors/router.js')(server, resolved.pointer.pointer.domain);
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
                ctx.view();
            }
        }
    };

    return {
        route: function (ctx, next) {
            if (ctx.uri.path !== '/') {
                send(ctx.req, url.parse(ctx.uri.path).pathname)                    
                    .root('public')
                    .on('error', function (err) {
                        try {
                            var node = require('../cms/nodeMngr.js')(server, ctx.db);

                            node.resolveUrl(ctx.uri.url, function (resolved) {

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
                                    if (server.app.localization.enabled) {
                                        var languages = server.app.languages;

                                        var matched = _.filter(languages, function (x) { return _.str.startsWith(ctx.uri.path, '/' + x.code + '/'); });
                                        if (matched.length === 0) {
                                            console.log(11);
                                            ctx.db.languages.getCached({ active: true, "default": true }, function (defaultLanguages, defaultLanguagesError) {
                                                if (defaultLanguagesError) {
                                                    ctx.error(500, defaultLanguagesError);
                                                }
                                                else {
                                                    var defaultLanguage = _.first(defaultLanguages);
                                                    if (defaultLanguage) {
                                                        var newUrl = '/' + defaultLanguage.code + ctx.uri.path;
                                                        node.resolveUrl(newUrl, function (newUrlResolved) {
                                                            if (newUrlResolved) {
                                                                ctx.redirect(newUrl, 301);
                                                            }
                                                            else {
                                                                next();
                                                            }
                                                        });
                                                    }
                                                    else {
                                                        next();
                                                    }
                                                }
                                            });
                                        }
                                        else {
                                            next();
                                        }
                                    }
                                    else {
                                        next();
                                    }
                                }
                            });
                        }
                        catch (err) {
                            logger.error(ctx.req.method, ctx.req.url, err);
                            ctx.error(500, err);
                        }
                    })
                    .pipe(ctx.res);
            }
            else {
                next();
            }
        }

    };
};

module.exports = PublicRouter;