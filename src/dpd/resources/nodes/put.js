var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);

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

if (internal) {
    processChildren(this.domain, this.hierarchy);
}
else {
    if (!auth.isAuthorized(me, 'nodes', 'U'))
        cancel('access denied', 500);

    self.modifiedOn = new Date().getTime();

    var hierarchyChange = false;

    if (changed('parent') && self.parent !== previous.parent) {
        hierarchyChange = true;
    }

    //var seoNamesChanged = false;
    //for (var lang in self.url) {
    //    if (self.url[lang] !== previous.url[lang]) {
    //        seoNamesChanged = true;
    //    }
    //}

    //if (seoNamesChanged) {
    //    var siblingNodes = (dpd.nodes.get, { parent: self.parent, domain: self.domain, id: { $nin: [self.id] } });
    //    for (var lang in self.url) {
    //        var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.url[lang]; }), 'url'), lang);
    //        if (siblingSeoNames.indexOf(self.url[lang]) === -1) {
    //            cancel('seo name already exists', 400);
    //        }
    //    }
    //}

    //for (var lang in self.data.localized) {
    //    if (previous.data.localized[lang]) {
    //        if (previous.data.localized[lang].seoName !== self.data.localized[lang.seoName]) {
    //            cascadeProcess = true;
    //        }
    //    }
    //}

    if (hierarchyChange) {
        node.getHierarchy(self, function (hierarchyNodes) {
            var hierarchyNodeIds = _.pluck(hierarchyNodes, 'id');
            self.hierarchy = hierarchyNodeIds;
            processChildren(self.domain, self.hierarchy);
        });
    }

    emit('nodeUpdated', self);
}