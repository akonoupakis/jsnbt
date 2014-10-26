var app = require('../app.js');
var error = require('../error.js');
var view = require('../view.js');
var auth = require('../auth.js');
var jsnbt = require('../jsnbt.js');
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
            if (ctx.node)
                view.render(ctx);
            else
                error.render(ctx, 404);
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

                            if (!restricted && jsnbt.restricted) {
                                if (!auth.isInRole(ctx.req.session.user, resolved.getPermissions())) {
                                    restricted = true;
                                }
                            }

                            if (restricted) {
                                ctx.dpd.settings.get({ domain: 'core' }, function (settingNodes, settingNodesError) {
                                    if (settingNodesError) {
                                        error.render(ctx, 500, settingNodesError.toString());
                                    }
                                    else {
                                        var settingNode = _.first(settingNodes);
                                        if (settingNode && settingNode.data && settingNode.data.restricted && settingNode.data.loginpage) {
                                            ctx.dpd.nodes.get(settingNode.data.loginpage, function (loginNode, loginNodeError) {
                                                if (loginNodeError) {
                                                    error.render(ctx, 500, loginNodeError.toString());
                                                }
                                                else {
                                                    node.buildUrl(loginNode, function (loginUrlResult) {
                                                        var loginUrl = loginUrlResult[resolved.language];

                                                        if (loginUrl !== '') {
                                                            ctx.res.writeHead(302, { "Location": loginUrl });
                                                            ctx.res.end();
                                                        }
                                                        else {
                                                            error.render(ctx, 401, 'Access denied');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            error.render(ctx, 401, 'Access denied');
                                        }
                                    }
                                });
                            }
                            else {
                                ctx.node = resolved.page || {};
                                ctx.pointer = resolved.pointer || {};
                                ctx.language = jsnbt.localization ? resolved.language || 'en' : jsnbt.locale;
                                ctx.view = resolved.view || '';
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
                                    view.render(ctx);
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
                    error.render(ctx, 500, err.toString());
                }
            }
            else {
                next();
            }
        }
    };
};