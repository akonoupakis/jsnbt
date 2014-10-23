var dpdSync = require('dpd-sync');
var auth = requireApp('auth.js');
var node = requireApp('node.js');

var _ = require('underscore');

var self = this;

var processFn = function () {

    if (!auth.isAuthorized(me, 'nodes', 'U'))
        cancel('access denied', 500);

    self.modifiedOn = new Date().getTime();

    var hierarchyChange = false;
    var cascadeProcess = false;

    if (changed('parent') && self.parent !== previous.parent) {
        hierarchyChange = true;
        cascadeProcess = true;
    }

    //var seoNamesChanged = false;
    //for (var lang in self.url) {
    //    if (self.url[lang] !== previous.url[lang]) {
    //        seoNamesChanged = true;
    //    }
    //}

    //if (seoNamesChanged) {
    //    var siblingNodes = dpdSync.call(dpd.nodes.get, { parent: self.parent, domain: self.domain, id: { $nin: [self.id] } });
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

    //if (changed('permissions.inherits') || (changed('permissions.roles') && !_.isEmpty(_.difference(previous.permissions.roles, self.permissions.roles)))) {
    //    cascadeProcess = true;
    //}


    if (hierarchyChange) {
        var hierarchy = node.getHierarchy(self).slice(0);
        self.hierarchy = hierarchy.slice(0);
        self.config.saving = true;
        dpd.nodes.put(self.id, self, function (result, err) {
            if (err)
                throw err;
        });
        //  processChildren([self]);
    }

    //node.materialize(self);

    //if (cascadeProcess) {
    //    
    //}

    emit('nodeUpdated', self);
};

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
                    nodeResult.config.saving = true;

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
    if (this.config.saving) {
        delete this.config.saving;

        processChildren(this.domain, this.hierarchy);
    }
}
else {
    dpdSync.wrap(processFn);
}