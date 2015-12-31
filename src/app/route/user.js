function Router(server) {
    this.server = server;
}

Router.prototype.route = function (ctx, next) {
    var store = this.server.db.createStore('users', false);
    store.get(function(x){
        x.query({
            username: 'konoupakis@gmail.com'
        });
        x.single();
    }, function (error, result) {
        if (error) {
            if (typeof (error) === 'object') {
                if (error.code && error.messages) {
                    ctx.res.status(error.code).send(error.messages);
                }
                else {
                    ctx.res.status(500).send(error.message);
                }
            }
            else {
                ctx.res.status(500).send(error);
            }
        }
        else {
            if (result) {
                ctx.res.send(result);
            }
            else {
                ctx.res.status(404).send({
                    404: 'null'
                });
            }
        }
    });
};

module.exports = function (server) {
    return new Router(server);
};