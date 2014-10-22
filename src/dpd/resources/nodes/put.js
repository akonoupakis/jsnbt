var dpdSync = require('dpd-sync');
var auth = requireApp('auth.js');
var node = requireApp('node.js');

var _ = require('underscore');

var self = this;
var mee = this;

var processFn = function () {
    if (internal) {
        //delete self.config.computed;

        console.log('internal put');
        if (changed('hierarchy') && !_.isEmpty(_.difference(previous.hierarchy, self.hierarchy))) {
            console.log('in!', self.hierarchy);
            processChildren(self);
        }
    }
    else {
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
            //self.config.computed = true;
            console.log('h', hierarchy);
            dpd.nodes.put(self.id, { hierarchy: hierarchy }, function (result, err) {
                if (err)
                    console.log(err);
            });
          //  processChildren([self]);
        }

        //node.materialize(self);

        //if (cascadeProcess) {
        //    
        //}

        emit('nodeUpdated', self);
    }
};

var processChildren = function (nodeObj) {
    
    dpd.nodes.get({ domain: nodeObj.domain, parent: nodeObj.id }, function (results, error) {
        if (error) {
            throw error;
        }
        else {
            _.each(results, function (nodeResult) {
                    var newHierarchy = nodeObj.hierarchy.slice(0);
                    newHierarchy.push(nodeResult.id);
                    dpd.nodes.put(nodeResult.id, { hierarchy: newHierarchy }, function (result, err) {
                        if (err)
                            console.log(err);
                    });
            });
        }
    });

};

dpdSync.wrap(processFn);