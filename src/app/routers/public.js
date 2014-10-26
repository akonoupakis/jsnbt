var app = require('../app.js');
var auth = require('../auth.js');
var jsnbt = require('../jsnbt.js');
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
                ctx.error(ctx, 404);
        }
    });
    
    return {
        route: function (ctx, next) {
            if (ctx.uri.path !== '/') {
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
                                                            ctx.redirect(loginUrl + '?returnUrl=' + encodeURIComponent(ctx.uri.url));
                                                        }
                                                        else {
                                                            ctx.error(401, 'Access denied');
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                        else {
                                            ctx.error(401, 'Access denied');
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
                                    ctx.render();
                                }
                            }
                        }
                        else {
                            if (jsnbt.localization) {
                                var languages = jsnbt.languages;

                                var matched = _.filter(languages, function (x) { return _.str.startsWith(ctx.uri.path, '/' + x.code + '/'); });
                                if (matched.length === 0) {
                                    ctx.dpd.languages.get({ active: true, "default": true }, function (defaultLanguages, defaultLanguagesError) {
                                        if (defaultLanguagesError) {
                                            error.render(ctx, 500, defaultLanguagesError.toString());
                                        }
                                        else {
                                            var defaultLanguage = _.first(defaultLanguages);
                                            if (defaultLanguage) {
                                                var newUrl = '/' + defaultLanguage.code + ctx.uri.path;
                                                node.resolveUrl(newUrl, function (newUrlResolved) {
                                                    if (newUrlResolved) {
                                                        ctx.res.writeHead(302, { "Location": newUrl });
                                                        ctx.res.end();
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
                    app.logger.error(err);
                    ctx.error(500, err.toString());
                }
            }
            else {
                next();
            }
        }
    };
};