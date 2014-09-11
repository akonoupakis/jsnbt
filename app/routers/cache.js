var app = require('../app.js');
var error = require('../error.js');
var _ = require('underscore');

module.exports = function () {

    return {
        route: function (ctx, next) {
            if (ctx.uri.first == 'jsnbt-cache') {
                if (ctx.uri.parts.length != 3) {
                    error.render(ctx, 400);
                }
                else {
                    try {
                        var domain = _.first(ctx.uri.parts.slice(1)).toLowerCase();
                        var key = _.first(ctx.uri.parts.slice(2)).toLowerCase();

                        switch (ctx.req.method) {
                            case 'GET':
                                var value = app.cache.get(domain + ':' + key);

                                ctx.res.writeHead(200, { "Content-Type": "application/json" });
                                ctx.res.write(JSON.stringify({ d: value }));
                                ctx.res.end();

                                break;
                            case 'POST':
                                //throw new Error('not implemented');

                                //var value = '';

                                //if (!query.value) {
                                //    error.render(ctx, 400);
                                //}
                                //else {
                                //    var jsonValue = JSON.parse(decodeURIComponent(value));
                                //    app.cache.set(domain + ':' + key, jsonValue);

                                //    ctx.res.writeHead(200, { "Content-Type": "application/json" });
                                //    ctx.res.write(JSON.stringify({ d: value }));
                                //    ctx.res.end();
                                //}
                                break;
                        }
                    }
                    catch (err) {
                        app.logger.error(err);
                        error.render(ctx, 500, err.toString());
                    }
                }
            }
            else {
                next();
            }
        }
    };
};