var formidable = require('formidable');
var _ = require('underscore');

_.str = require('underscore.string');

var getPostParams = function (ctx, onSuccess, onFailure) {
    var form = new formidable.IncomingForm();
    form.parse(ctx.req, function (err, fields, files) {
        if (err) {
            onFailure(err);
        }
        else {
            onSuccess(fields, files);
        }
    });
};

var getGetParams = function (ctx, onSuccess, onFailure) {
    onSuccess(ctx.uri.query);
}

var ApiRouter = function (server) {

    return {

        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-api' && ctx.uri.parts.length === 4) {

                var domain = ctx.uri.parts[1].toLowerCase();
                var serviceName = ctx.uri.parts[2];
                var fnName = ctx.uri.parts[3];

                if (domain === 'core') {

                    var service = null;
                    try {
                        service = require('../api/' + serviceName + '.js')(server);
                    }
                    catch (e) { }

                    if (service !== null && _.isFunction(service[fnName])) {
                        if (ctx.method === 'POST') {
                            getPostParams(ctx, function (fields, files) {
                                service[fnName].apply(service[fnName], [ctx, fields]);
                            }, function (err) {
                                ctx.error(500, err, 'application/text');
                            });
                        }
                        else {
                            getGetParams(ctx, function (fields) {
                                service[fnName].apply(service[fnName], [ctx, fields]);
                            }, function (err) {
                                ctx.error(500, err, 'application/text');
                            });
                        }
                    }
                    else {
                        ctx.error(404);
                    }

                }
                else {
                    var apiRouter = require('./processors/api.js')(server, domain);
                    if (apiRouter) {
                        if (ctx.method === 'POST') {
                            getPostParams(ctx, function (fields, files) {
                                apiRouter.route(ctx, serviceName, fnName, fields, files);
                            }, function (err) {
                                ctx.error(500, err, 'application/text');
                            });
                        }
                        else {
                            getGetParams(ctx, function (fields) {
                                apiRouter.route(ctx, serviceName, fnName, fields);
                            }, function (err) {
                                ctx.error(500, err, 'application/text');
                            });
                        }
                    }
                    else {
                        ctx.error(404);
                    }

                }
            }
            else {
                next();
            }
        }
    };

};

// routes should be as: /jsnbt-api/{domain}/{serviceName}/{fnName}
module.exports = ApiRouter;