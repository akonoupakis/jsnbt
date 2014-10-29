var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);
var cache = requireApp('cache.js');

var _ = require('underscore');

var self = this;

var processChildren = function (domain, hierarchy) {
    if (hierarchy.length > 0) {
        var nodeId = hierarchy[hierarchy.length - 1];
        dpd.nodes.get({ domain: domain, parent: nodeId }, function (results, error) {
            if (error) {
                throw error;
            }
            else {
                _.each(results, function (nodeResult) {
                    var newHierarchy = hierarchy.slice(0);
                    newHierarchy.push(nodeResult.id);
                    nodeResult.hierarchy = newHierarchy.slice(0);
                    
                    dpd.nodes.put(nodeResult.id, nodeResult, function (result, err) {
                        if (err)
                            throw err;
                    });
                });
            }
        });
    }
};

var entity = requireApp('entity.js')(self.entity);

if (internal) {
    if (entity.hasProperty('parent'))
        processChildren(this.domain, this.hierarchy);
}
else {
    if (!auth.isAuthorized(me, 'nodes', 'U'))
        cancel('access denied', 500);

    self.modifiedOn = new Date().getTime();

    var hierarchyChange = false;
    
    if (entity.hasProperty('parent') && changed('parent') && self.parent !== previous.parent) {
        hierarchyChange = true;
    }

    var seoNamesChanged = false;
    if (entity.hasProperty('seo')) {
        for (var lang in self.url) {
            if (self.url[lang] !== previous.url[lang]) {
                seoNamesChanged = true;
            }
        }

        if (seoNamesChanged) {
            dpd.nodes.get({ parent: self.parent, domain: self.domain, id: { $nin: [self.id] } }, function (siblingNodes, siblingNodesError) {
                if (siblingNodesError)
                    throw siblingNodesError;
                else {
                    for (var lang in self.url) {
                        var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.url[lang]; }), 'url'), lang);
                        if (siblingSeoNames.indexOf(self.url[lang]) !== -1) {
                            cancel('seo name already exists', 400);
                        }
                    }
                }
            });
        }

        cache.purge(self.id);
    }

    if (hierarchyChange) {
        node.getHierarchy(self, function (hierarchyNodes) {
            var hierarchyNodeIds = _.pluck(hierarchyNodes, 'id');
            self.hierarchy = hierarchyNodeIds;

            cache.purge(self.id);

            processChildren(self.domain, self.hierarchy);
        });
    }

    emit('nodeUpdated', self);
}