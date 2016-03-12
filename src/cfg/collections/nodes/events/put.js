var async = require('async');
var _ = require('underscore');

module.exports = function (sender, context, data) {

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    var nodeMngr = sender.server.require('./cms/nodeMngr.js')(sender.server);
    
    delete context.raw.enabled;
    delete context.raw.url;

    var processChildren = function (domain, hierarchy, cb) {
        if (hierarchy.length > 0) {
            var nodeId = hierarchy[hierarchy.length - 1];
            context.store.get(function (x) {
                x.query({
                    domain: domain,
                    parent: nodeId
                });
            }, function (error, results) {
                if (error) 
                    return cb(error);
                
                var processAsyncs = [];

                _.each(results, function (nodeResult) {
                    processAsyncs.push(function (pcb) {
                        var newHierarchy = hierarchy.slice(0);
                        newHierarchy.push(nodeResult.id);

                        context.store.put(function (x) {
                            x.query(nodeResult.id);
                            x.data({
                                hierarchy: newHierarchy
                            })
                        }, function (err, result) {
                            pcb(err, result);
                        });
                    });
                });

                if (processAsyncs.length > 0) {
                    async.parallel(processAsyncs, function (err, result) {
                        cb(err, result);
                    });
                }
                else {
                    cb();
                }

            });
        }
    };

    var entity = nodeMngr.getEntity(data.entity);

    if (context.internal) {
        if (entity.hasProperty('parent') && context.changed('parent')) {
            processChildren(data.domain, data.hierarchy, function (err, result) {
                if (err)
                    return context.error(err);

                context.done();
            });
        }
        else {
            context.done();
        }
    }
    else {
        if (!authMngr.isAuthorized(context.req.session.user, 'nodes:' + data.entity, 'U'))
            return context.error(401, 'Access denied');

        data.modifiedOn = new Date().getTime();

        var asyncs = [];

        asyncs.push(function (cb) {
            var seoNamesChanged = false;
            if (!entity.hasProperty('seo'))
                return cb();

            for (var lang in data.seo) {
                if (data.seo[lang] !== context.previous.seo[lang]) {
                    seoNamesChanged = true;
                }
            }

            if (!seoNamesChanged) 
                return cb();

            context.store.get(function (x) {
                x.query({
                    parent: data.parent,
                    domain: data.domain,
                    id: { $nin: [data.id] }
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
        });

        asyncs.push(function (cb) {
            var hierarchyChange = entity.hasProperty('parent') && context.changed('parent') && data.parent !== context.previous.parent;
            if (!hierarchyChange) 
                return cb();
            
            nodeMngr.getHierarchy(data, function (hErr, hierarchyNodes) {
                if (hErr)
                    return cb(hErr);

                var hierarchyNodeIds = _.pluck(hierarchyNodes, 'id');
                context.raw.hierarchy = hierarchyNodeIds;

                nodeMngr.purgeCache(data.id);

                processChildren(data.domain, hierarchyNodeIds, function (err, result) {
                    cb(err, result);
                });
            });
        });

        async.parallel(asyncs, function (err, result) {
            if (err)
                return context.error(err);

            context.done();
        });
    }

};