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

var Router = function (server) {
    this.server = server;
};

Router.prototype.route = function (ctx, domain, serviceName, fnName, next) {
    var self = this;

    if (domain === 'core') {

        var service = null;
        try {
            service = require('../api/' + serviceName + '.js')(self.server);
        }
        catch (e) { }

        if (service !== null && _.isFunction(service[fnName])) {
            if (ctx.method === 'POST') {
                getPostParams(ctx, function (fields, files) {
                    service[fnName].apply(service, [ctx, fields]);
                }, function (err) {
                    ctx.status(500).send(err);
                });
            }
            else {
                getGetParams(ctx, function (fields) {
                    service[fnName].apply(service, [ctx, fields]);
                }, function (err) {
                    ctx.status(500).send(err);
                });
            }
        }
        else {
            next();
        }

    }
    else {
        var apiRouter = require('./processors/api.js')(self.server, domain);
        if (apiRouter) {
            if (ctx.method === 'POST') {
                getPostParams(ctx, function (fields, files) {
                    apiRouter.route(ctx, serviceName, fnName, fields, files);
                }, function (err) {
                    ctx.status(500).send(err);
                });
            }
            else {
                getGetParams(ctx, function (fields) {
                    apiRouter.route(ctx, serviceName, fnName, fields);
                }, function (err) {
                    ctx.status(500).send(err);
                });
            }
        }
        else {
            next();
        }
    }
};

module.exports = function (server) {
    return new Router(server);
};