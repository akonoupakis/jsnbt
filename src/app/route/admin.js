var _ = require('underscore');
_.str = require('underscore.string');

var Router = function (server) {
    this.server = server;
};

Router.prototype.route = function (ctx, next) {
    ctx.template = 'admin';

    ctx.robots.noindex = true;
    ctx.robots.nofollow = true;

    ctx.view();
};

module.exports = function (server) {
    return new Router(server);
};