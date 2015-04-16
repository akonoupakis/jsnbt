var app = require('../app.js');

var SiteRouter = function (server) {
    
    return {

        route: function (ctx, next) {
            if (app.modules.public && typeof (app.modules.public.route) === 'function') {
                app.modules.public.route(server, ctx, next);
            }
            else {
                next();
            }
        }

    };

};

module.exports = SiteRouter;