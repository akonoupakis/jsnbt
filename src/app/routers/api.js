var app = require('../app.js');
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


module.exports = function () {

    return {
        route: function (ctx, next) {

            if (ctx.uri.first === 'jsnbt-api' && ctx.uri.parts.length > 1) {

                var domain = ctx.uri.parts[1];

                if (domain === 'core') {

                    var serviceName = ctx.uri.parts[2];

                    var service = null;
                    try {
                        service = require('../api/' + serviceName + '.js');
                    }
                    catch (e) { }
                    
                    if (service !== null) {
                        if (ctx.req.method === 'POST') {
                            getPostParams(ctx, function (fields, files) {
                                if (fields.fn && _.isFunction(service[fields.fn])) {
                                    service[fields.fn].apply(service[fields.fn], [ctx, fields]);
                                }
                                else {
                                    ctx.res.writeHead(404, { "Content-Type": "application/json" });
                                    ctx.res.end();
                                }
                            }, function (err) {
                                ctx.res.writeHead(500, { "Content-Type": "application/text" });
                                ctx.res.write(err.toString());
                                ctx.res.end();
                            });
                        }
                        else {
                            getGetParams(ctx, function (fields) {
                                if (fields.fn && _.isFunction(service[fields.fn])) {
                                    service[fields.fn].apply(service[fields.fn], [ctx, fields]);
                                }
                                else {
                                    ctx.res.writeHead(404, { "Content-Type": "application/json" });
                                    ctx.res.end();
                                }
                            }, function (err) {
                                ctx.res.writeHead(500, { "Content-Type": "application/text" });
                                ctx.res.write(err.toString());
                                ctx.res.end();
                            });
                        }
                    }
                    else {
                        ctx.res.writeHead(404, { "Content-Type": "application/json" });
                        ctx.res.end();
                    }
                }
                else {

                    var module = _.find(app.modules, function (x) { return x.domain === domain; });
                    if (module) {

                        if (_.isFunction(module.routeApi)) {

                            if (ctx.req.method === 'POST') {
                                getPostParams(ctx, function (fields, files) {
                                    module.routeApi(ctx, fields);
                                }, function (err) {
                                    ctx.res.writeHead(500, { "Content-Type": "application/text" });
                                    ctx.res.write(err.toString());
                                    ctx.res.end();
                                });
                            }
                            else {
                                getGetParams(ctx, function (fields) {
                                    module.routeApi(ctx, fields);
                                }, function (err) {
                                    ctx.res.writeHead(500, { "Content-Type": "application/text" });
                                    ctx.res.write(err.toString());
                                    ctx.res.end();
                                });
                            }
                        }
                        else {
                            ctx.res.writeHead(404, { "Content-Type": "application/json" });
                            ctx.res.end();
                        }
                    }
                    else {
                        ctx.res.writeHead(404, { "Content-Type": "application/json" });
                        ctx.res.end();
                    }
                }
            }
            else {
                next();
            }
        }
    };
};