var SiteRouter = function (server) {
    
    return {

        route: function (ctx, next) {
            if (server.app.modules.public && typeof (server.app.modules.public.route) === 'function') {
                server.app.modules.public.route(server, ctx, next);
            }
            else {
                next();
            }
        }

    };

};

module.exports = SiteRouter;