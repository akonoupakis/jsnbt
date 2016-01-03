var _ = require('underscore');

var ApiRouteProcessor = function (server, domain) {
    this.server = server;
    this.domain = domain;
};

ApiRouteProcessor.prototype.route = function (ctx, serviceName, fnName, fields, files, next) {
    var self = this;

    var moduleRouter = _.find(self.server.app.modules.all, function (x) {
        return x.domain.toLowerCase() === self.domain.toLowerCase()
            && x.routeApi && _.isFunction(x.routeApi);
    });

    if (moduleRouter)
        moduleRouter.routeApi(self.server, ctx, serviceName, fnName, fields, files, next);
    else
        next();
};

module.exports = function (server, domain) {
    return new ApiRouteProcessor(server, domain);
};