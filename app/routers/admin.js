var view = require('../view.js');

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
                        else if (location === 'login.html')
                            viewPath = '/admin/tmpl/view/login.html';
                    }

                    if (viewPath !== null) {
                        view.render(ctx, viewPath);
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