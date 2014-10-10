var app = require('../app.js');
var dpdSync = require('dpd-sync');
var nodeService = require('../services/node.js');
var error = require('../error.js');
var view = require('../view.js');
var auth = require('../user.js');
var languageService = require('../services/language.js');
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
            error.render(ctx, 404);
        }
    });

    return {
        sync: true,
        route: function (ctx, next) {
            if (ctx.uri.path === '/') {
                try {
                    var settingNode = _.first(dpdSync.call(app.dpd.settings.get, { domain: 'core' }));
                    if (settingNode && settingNode.data && settingNode.data.homepage) {
                        var defaultLanguage = languageService.getDefault();
                        var resolved = nodeService.getById(settingNode.data.homepage, defaultLanguage);
                        if (resolved) {

                            var restricted = true;
                            _.each(resolved.permissions, function (role) {
                                if (auth.isInRole(ctx.req.session.user, role)) {
                                    restricted = false;
                                }
                            });
                           
                            if (restricted) {
                                error.render(ctx, 401, 'Access denied');
                            }
                            else {
                                var session = app.session.start(ctx.req, ctx.res);
                                session.set('language', resolved.language);

                                ctx.node = resolved;

                                //if (resolved.ref) {
                                //    ctx.node = resolved;

                                //    var nextIndex = 0;
                                //    var nextInternal = function () {
                                //        nextIndex++;
                                //        var router = addonRouters[nextIndex];
                                //        router.route(ctx, nextInternal);
                                //    };

                                //    var first = _.first(addonRouters);
                                //    first.route(ctx, nextInternal);
                                //}
                                //else {
                                ctx.uri.scheme = resolved.secure === true ? 'https' : 'http';
                                _.extend(ctx.meta, resolved.meta);
                                view.render(ctx, resolved.view);
                                //}
                            }
                        }
                        else {
                            next();
                        }
                    }
                    else {
                        next();
                    }                    
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