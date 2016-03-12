var async = require('async');
var validation = require('json-validation');
var _ = require('underscore');

var NodeApi = function (server) {

    this.server = server;

};

NodeApi.prototype.sort = function (ctx, fields) {
    var self = this;

    var logger = this.server.getLogger();
    
    var validator = new validation.JSONValidation();
    var validationResult = validator.validate(fields, {
        type: 'object',
        required: true,
        properties: {
            parent: {
                type: 'string',
                required: true
            },
            ids: {
                type: 'array',
                required: true,
                items: {
                    type: 'string',
                    required: true
                }
            }
        }
    });
    if (!validationResult.ok) {
        var validationErrors = validationResult.path + ': ' + validationResult.errors.join(' - ');
        return ctx.error(400, 'validation error on nodes sort object\n' + validationErrors);
    }

    var authMngr = require('../cms/authMngr.js')(this.server);
    if (!authMngr.isAuthorized(ctx.req.session.user, 'nodes', 'U'))
        return ctx.error(401, 'Access Denied');

    var nodeMngr = require('../cms/nodeMngr.js')(this.server);
    
    var asyncs = [];

    var nodesStore = this.server.db.createStore('nodes');
    _.each(fields.ids, function (nodeId, i) {
        asyncs.push(function (cb) {
            nodesStore.put(function (x) {
                x.query({
                    id: nodeId
                });
                x.data({
                    order: (i + 1)
                });
            }, cb);
        });
    });

    async.parallel(asyncs, function (err, result) {
        if (err)
            return ctx.error(500, err);

        ctx.json(null);
    });

};

module.exports = function (server) {
    return new NodeApi(server);
};