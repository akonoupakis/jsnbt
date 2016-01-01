var Router = function (server) {
    this.server = server;
};

Router.prototype.route = function (ctx, serviceName, next) {
    var self = this;

    var service = null;
    try {
        service = require('../dev/' + serviceName + '.js')(self.server);
    }
    catch (e) { }

    if (service !== null && typeof (service.route) === 'function') {
        service.route(ctx, next);
    }
    else {
        next();
    }

};

module.exports = function (server) {
    return new Router(server);
};