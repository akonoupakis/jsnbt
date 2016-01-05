var async = require('async');
var _ = require('underscore');

module.exports = function (sender, context, data) {

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    var nodeMngr = sender.server.require('./cms/nodeMngr.js')(sender.server);
    
    if (!context.internal) {
        if (!authMngr.isAuthorized(context.req.session.user, 'nodes:' + data.entity, 'R'))
            return context.error(401, 'Access denied');

        var asyncs = [];

        asyncs.push(function (cb) {
            nodeMngr.getUrl(data, function (err, builtUrl) {
                if (err)
                    return cb(err);

                data.url = builtUrl;
                cb(null, builtUrl);
            });
        });

        asyncs.push(function (cb) {
            nodeMngr.getEnabled(data, function (err, enabledObj) {
                if (err)
                    return cb(err);

                data.enabled = enabledObj;
                cb(null, enabledObj);
            });
        });

        asyncs.push(function (cb) {
            if (!authMngr.isInRole(context.req.session.user, 'admin')) {
                context.hide('roles');
                context.hide('robots');
                context.hide('template');
                context.hide('meta');
                context.hide('layouts');

                context.hide('createdOn');
                context.hide('modifiedOn');
            }

            cb();
        });

        async.parallel(asyncs, function (err, results) {
            if (err)
                return context.error(err);

            context.done();
        });
    }
    else {
        context.done();
    }

};