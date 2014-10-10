var app = require('../app.js');
var error = require('../error.js');
var view = require('../view.js');
var nodeService = require('../services/node.js');
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
            error.render(ctx, 404);
        }
    });


    return {
        sync: true,
        route: function (ctx, next) {
            try {
                var resolved = nodeService.getByUrl(ctx.uri.url);
                if (resolved) {

                    var session = app.session.start(ctx.req, ctx.res);
                    session.set('language', resolved.language);

                    ctx.node = resolved;

                    //if (resolved.ref) {

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
                else {
                    next();
                }
            }
            catch (err) {
                app.logger.error(err);
                error.render(ctx, 500, err.toString());
            }
        }
    };
};