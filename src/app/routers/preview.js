var app = require('../app.js');
var dpdSync = require('dpd-sync');
var error = require('../error.js');
var view = require('../view.js');

module.exports = function () {

    return {
        sync: true,
        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-preview') {
                if (!ctx.req.session.user) {
                    error.render(ctx, 401);
                }
                else if (ctx.req.method !== 'GET') {
                    error.render(ctx, 405);
                }
                else if (ctx.uri.parts.length != 2) {
                    error.render(ctx, 400);
                }
                else {
                    var nodeParts = ctx.uri.parts[1].split('-');
                    if (nodeParts.length !== 2) {
                        error.render(ctx, 400);
                    }
                    else {
                        var nodeLanguage = nodeParts[0];
                        var nodeId = nodeParts[1];

                        var node = dpdSync.call(app.dpd.nodes.get, nodeId);
                        if (node && node.data && node.data.localized && node.data.localized[nodeLanguage]) {
                            var session = app.session.start(ctx.req, ctx.res);
                            session.set('language', nodeLanguage);

                            ctx.draft = true;
                            ctx.node = node;
                            view.render(ctx, node.view);
                        }
                        else {
                            error.render(ctx, 400);
                        }
                    }
                }
            }
            else {
                next();
            }
        }
    };
};