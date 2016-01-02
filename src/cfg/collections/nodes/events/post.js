var async = require('async');
var _ = require('underscore');

module.exports = function (sender, context, data) {

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    var node = sender.server.require('./cms/nodeMngr.js')(sender.server);

    if (!internal && !authMngr.isAuthorized(context.req.session.user, 'nodes:' + data.entity, 'C'))
        return context.error(401, 'Access denied');

    var entity = sender.server.require('./cms/entityMngr.js')(sender.server, data.entity);

    data.createdOn = new Date().getTime();

    var asyncs = [];

    asyncs.push(function (cb) {
        if (entity.hasProperty('seo')) {
            context.store.get(function (x) {
                x.query({
                    parent: data.parent,
                    domain: data.domain,
                    id: {
                        $nin: [data.id]
                    }
                });
            }, function (siblingNodesError, siblingNodes) {
                if (siblingNodesError)
                    return cb(siblingNodesError);
                
                for (var lang in data.seo) {
                    if (data.active[lang]) {
                        var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.seo[lang]; }), 'seo'), lang);
                        if (siblingSeoNames.indexOf(data.seo[lang]) !== -1) {
                            return cb('seo name already exists');
                        }
                    }
                }

                cb();
            });
        }
        else {
            cb();
        }
    });
    
    asyncs.push(function (cb) {
        node.getHierarchy(data, function (hierarchyNodes) {
            data.hierarchy = _.pluck(hierarchyNodes, 'id');
            cb();
        });
    });

    async.parallel(asyncs, function (err, result) {
        if (err)
            return context.error(err);

        context.done();
    });

};