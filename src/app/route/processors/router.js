var _ = require('underscore');

var RouterRouteProcessor = function (server, routeId) {
    this.server = server;
    this.routeId = routeId;
};

RouterRouteProcessor.prototype.route = function (ctx, next) {
    var self = this;

    var configRoute = _.find(self.server.app.config.routes, function (x) { return x.id === self.routeId; });

    var configRouteFn = configRoute !== undefined ? configRoute.fn : '';

    var moduleRouter = self.server.app.modules.public && _.isFunction(self.server.app.modules.public[configRouteFn]) ? self.server.app.modules.public : undefined;
    
    if(moduleRouter)
        moduleRouter[configRouteFn](self.server, ctx, next);
    else
        next();
};

module.exports = function (server, routeId) {
    return new RouterRouteProcessor(server, routeId);
};