var _ = require('underscore');
_.str = require('underscore.string');

var AdminRouter = function (server) {

    var logger = require('../logger.js')(this);

    return {
        
        route: function (ctx, next) {
            if (ctx.uri.first === 'admin') {
                try {
                    var viewPath = null;

                    if (ctx.uri.parts.length == 1) {
                        viewPath = '/admin/index.html';
                    }
                    else if (ctx.uri.parts.length > 1) {
                        var location = ctx.uri.parts[1];
                        if (location === 'index.html')
                            viewPath = '/admin/index.html';
                        else if (location === 'logging')
                            viewPath = '/admin/tmpl/core/pages/blank.html';
                    }

                    if (ctx.req.url.toLowerCase() === '/admin' || _.str.startsWith(ctx.req.url.toLowerCase(), '/admin#')) {
                        if (_.str.startsWith(ctx.req.url.toLowerCase(), '/admin#'))
                            ctx.redirect(ctx.req.url.replace(/\/admin#/, '/admin/#'));

                        ctx.redirect("/admin/");
                    }
                    else {
                        if (viewPath !== null) {
                            ctx.template = 'admin';

                            ctx.robots.noindex = true;
                            ctx.robots.nofollow = true;

                            ctx.view();
                        }
                        else {
                            next();
                        }
                    }
                }
                catch (err) {
                    logger.error(ctx.req.method, ctx.req.url, err);
                    ctx.error(500, err);
                }
            }
            else {
                next();
            }
        }

    };

};

module.exports = AdminRouter;