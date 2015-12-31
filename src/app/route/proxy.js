function Router(server) {
    this.server = server;
}

Router.prototype.route = function (ctx, next) {
    var self = this;

    var route = {
        method: ctx.req.method,
        collection: ctx.uri.parts[1],
        path: ctx.uri.path.substring('/jsnbt-db/'.length + ctx.uri.parts[1].length),
        query: JSON.stringify(ctx.uri.query.q || {}),
        data: ctx.req.body
    };

    ctx.req.on('end', function () {
        var jsonData = JSON.parse(postdata || '{}');
        route.data = jsonData;

        self.server.db.handle(route, next, function (error, results) {
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
                ctx.res.send(results);
            }
        });
    });

    var postdata = "";
    ctx.req.on('data', function (postdataChunk) {
        postdata += postdataChunk;
    });

};

module.exports = function (server) {
    return new Router(server);
};