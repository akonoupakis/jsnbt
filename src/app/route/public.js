var path = require('path');
var url = require('url');
var parseUri = require('parseUri');
var _ = require('underscore');

_.str = require('underscore.string');
    
var process = function (server, ctx, resolved, inherited, next) {
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
            pointerRouter.route(ctx, function () {
                if (ctx.node) {
                    ctx.debug('node ' + resolved.page.id + ' renders pointed not ' + ctx.node.id);
                    ctx.view();
                }
                else {
                    next();
                }
            });

        }
        else if (resolved.route) {
            ctx.url = resolved.url;

            ctx.debug('node ' + resolved.page.id + ' has a custom route: ' + resolved.route);
            var routeRouter = require('./processors/router.js')(server, resolved.route);
            routeRouter.route(ctx, function () { 
                ctx.error(500, 'custom route not found in public module: ' + resolved.route);
            });
        }
        else {
            ctx.debug('node ' + resolved.page.id + ' is rendering');
            ctx.view();
        }
    }
};

var Router = function (server) {

    this.server = server;

};

Router.prototype.route = function (ctx, next) {
    var self = this;

    var authMngr = require('../cms/authMngr.js')(self.server);
    var nodeMngr = require('../cms/nodeMngr.js')(self.server);
    var localeMngr = require('../cms/localeMngr.js')(self.server);

    nodeMngr.resolveUrl(ctx.uri.url, function (err, resolved) {
        if (err) {
            ctx.error(err);
        }
        else {
            if (resolved && resolved.page) {
                ctx.debug('node ' + resolved.page.id + ' resolved');
                if (resolved.isActive()) {
                    ctx.debug('node ' + resolved.page.id + ' is active');
                    var inherited = resolved.getInheritedProperties();

                    if (!ctx.restricted) {
                        if (!authMngr.isInRole(ctx.req.session.user, (inherited.roles || []))) {
                            ctx.restricted = true;
                        }
                    }
                    
                    if (self.server.app.modules.public && typeof (self.server.app.modules.public.routeNode) === 'function') {
                        self.server.app.modules.public.routeNode(self.server, ctx, resolved, function () {
                            process(self.server, ctx, resolved, inherited, next);
                        });
                    }
                    else {
                        process(self.server, ctx, resolved, inherited, next);
                    }
                }
                else {
                    ctx.debug('node ' + resolved.page.id + ' is inactive');
                    next();
                }
            }
            else {

                if (self.server.app.localization.enabled) {

                    var matched = _.filter(self.server.app.languages, function (x) { return _.str.startsWith(ctx.uri.path, '/' + x.code + '/'); });
                    if (matched.length === 0) {

                        localeMngr.getDefault(function (defaultLanguageErr, defaultLanguage) {
                            if (defaultLanguageErr)
                                return ctx.error(500, defaultLanguageErr);

                            if (defaultLanguage) {
                                nodeMngr.resolveUrl('/' + defaultLanguage + ctx.uri.path, function (newUrlResolved) {
                                    if (newUrlResolved) {
                                        var targetUrl = '/' + defaultLanguage + ctx.uri.url;
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
        }
    });
};

module.exports = function (server) {
    return new Router(server);
};