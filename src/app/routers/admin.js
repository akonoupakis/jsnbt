var view = require('../view.js');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function () {

    return {
        route: function (ctx, next) {
            if (ctx.uri.first === 'admin') {
                try {
                    var viewPath = null;

                    if (ctx.uri.parts.length == 1) {
                        viewPath = '/admin/tmpl/view/index.html';
                    }
                    else if (ctx.uri.parts.length > 1) {
                        var location = ctx.uri.parts[1];
                        if (location === 'index.html')
                            viewPath = '/admin/tmpl/view/index.html';
                        else if (location === 'logging')
                            viewPath = '/admin/tmpl/partial/blank.html';
                    }

                    if (ctx.req.url.toLowerCase() === '/admin' || _.str.startsWith(ctx.req.url.toLowerCase(), '/admin#')) {
                        if (_.str.startsWith(ctx.req.url.toLowerCase(), '/admin#'))
                            ctx.res.writeHead(302, { "Location": ctx.req.url.replace(/\/admin#/, '/admin/#') });

                        ctx.res.writeHead(302, { "Location": "/admin/" });

                        ctx.res.end();
                    }
                    else {
                        if (viewPath !== null) {
                            view.render(ctx, viewPath);
                        }
                        else {
                            next();
                        }
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