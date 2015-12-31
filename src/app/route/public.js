var path = require('path');
var send = require('send');
var url = require('url');
var parseUri = require('parseUri');
var _ = require('underscore');

_.str = require('underscore.string');
    
var Router = function (server) {

    var logger = require('../logger.js')(this);
    var authMngr = require('../cms/authMngr.js')(server);
        
    var process = function (ctx, resolved, inherited) {
        if (ctx.restricted) {
            ctx.debug('node ' + resolved.page.id + ' is restricted');
            ctx.error(401, 'Access denied');
        }
        else {
            ctx.node = resolved.page || {};
            ctx.pointer = resolved.pointer || {};
            ctx.inherited = inherited;
            ctx.layouts = ctx.inherited.layouts || [];
            ctx.language = server.app.localization.enabled ? resolved.language || server.app.localization.locale : server.app.localization.locale;
            ctx.template = resolved.template || '';
            ctx.hierarchy = resolved.getHierarchy();

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
                    ctx.debug('node ' + resolved.page.id + ' is pointing to ' + resolved.pointer.pointer.nodeId);
                    pointerRouter.route(ctx);
                }
                else {
                    if (ctx.node) {
                        ctx.debug('node ' + resolved.page.id + ' has a custom route: ' + resolved.route);
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
                    ctx.debug('node ' + resolved.page.id + ' has a custom route: ' + resolved.route);
                    routeRouter.route(ctx);
                }
                else {
                    ctx.error(500, 'custom route not found in public module: ' + resolved.route);
                }
            }
            else {
                ctx.debug('node ' + resolved.page.id + ' is rendering');
                ctx.view();
            }
        }
    };

    var resolveLanguage = function (node, ctx, next) {

        if (server.app.localization.enabled) {
            var languages = server.app.languages;

            var matched = _.filter(languages, function (x) { return _.str.startsWith(ctx.uri.path, '/' + x.code + '/'); });
            if (matched.length === 0) {
                ctx.db.languages.getCached({ active: true, "default": true }, function (defaultLanguagesError, defaultLanguages) {
                    if (defaultLanguagesError) {
                        ctx.error(500, defaultLanguagesError);
                    }
                    else {
                        var defaultLanguage = _.first(defaultLanguages);
                        if (defaultLanguage) {
                            node.resolveUrl('/' + defaultLanguage.code + ctx.uri.path, function (newUrlResolved) {
                                if (newUrlResolved) {
                                    var targetUrl = '/' + defaultLanguage.code + ctx.uri.url;
                                    ctx.debug('redirecting to ' + targetUrl);
                                    ctx.redirect(targetUrl, 301);
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

    };

    return {
        route: function (ctx, next) {
            try {
                var node = require('../cms/nodeMngr.js')(server, ctx.db);                         
                node.resolveUrl(ctx.uri.url, function (resolved) {
                    if (resolved) {
                        ctx.debug('node resolved: ' + resolved.page.id);
                        if (resolved.isActive()) {

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
                            if (!resolved.isActive()) {
                                ctx.debug('node ' + resolved.page.id + ' is inactive');
                                next();
                            }
                            else {
                                resolveLanguage(node, ctx, next);
                            }
                        }
                    }
                    else {
                        resolveLanguage(node, ctx, next);
                    }
                });
            }
            catch (err) {
                logger.error(ctx.req.method, ctx.req.url, err);
                ctx.error(500, err);
            }
        }

    };
};

module.exports = Router;