var _ = require('underscore');

var PointerRouterProcessor = function (server, domain) {
    this.server = server;
    this.domain = domain;
};

PointerRouterProcessor.prototype.route = function (ctx, next) {
    var self = this;

    var moduleRouter = _.find(self.server.app.modules.rest, function (x) {
        return x.domain.toLowerCase() === self.domain.toLowerCase()
            && x.routePointer && _.isFunction(x.routePointer);
    });

    if (moduleRouter)
        moduleRouter.routePointer(self.server, ctx, next);
    else
        next();
};

module.exports = function (server, domain) {
    return new PointerRouterProcessor(server, domain);
};