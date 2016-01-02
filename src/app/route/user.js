function Router(server) {
    this.server = server;
}

Router.prototype.route = function (ctx, next) {
    if (ctx.req.session.user)
        ctx.send(ctx.req.session.user);
    else
        ctx.status(401).send('Access Denied');
};

module.exports = function (server) {
    return new Router(server);
};