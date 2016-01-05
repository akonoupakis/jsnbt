function Router(server) {
    this.server = server;
}

Router.prototype.route = function (ctx, next) {
    var self = this;

    var route = {
        method: ctx.req.method,
        collection: ctx.uri.parts[1],
        path: ctx.uri.path.substring('/jsnbt-db/'.length + ctx.uri.parts[1].length),
        query: decodeURIComponent(ctx.uri.query.q || ''),
        data: ctx.req.body,
        req: ctx.req,
        res: ctx.res
    };

    ctx.req.on('end', function () {
        
        var jsonData = JSON.parse(postdata || '{}');
        route.data = jsonData;

        self.server.db.handle(route, function () {
            //ctx.json(null);
            next();
        }, function (error, results) {
            if (error) {
                if (typeof (error) === 'object') {
                    if (error.code && error.messages) {
                        ctx.error(error.code, error.messages);
                    }
                    else {
                        ctx.error(500, error.message);
                    }
                }
                else {
                    ctx.error(500, error);
                }
            }
            else {
                if (results) {
                    ctx.json(results);
                }
                else {
                    next();
                }
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