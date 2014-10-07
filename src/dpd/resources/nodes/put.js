var dpdSync = require('dpd-sync');
var user = requireApp('user.js');
var node = requireApp('node.js');

var _ = require('underscore');

var self = this;
var mee = this;

var processFn = function () {
    if (self.config.computed) {
        delete self.config.computed;
    }
    else {
        if (!internal && !user.isAuthorized(me, 'nodes', 'U'))
            cancel('access denied', 500);

        if (changed('code')) {
            if (matchedCode && matchedCode !== '') {
                var matchedCode = dpdSync.call(dpd.nodes.get, { code: self.code, domain: self.domain, id: { $nin: [self.id] } });
                if (matchedCode.length > 0)
                    cancel('node code already exists', 400);
            }
        }

        self.modifiedOn = new Date().getTime();

        var hierarchyChange = false;
        var cascadeProcess = false;

        if (changed('parent') && self.parent !== previous.parent) {
            hierarchyChange = true;
            cascadeProcess = true;
        }

        for (var lang in self.data.localized) {
            if (previous.data.localized[lang]) {
                if (previous.data.localized[lang].seoName !== self.data.localized[lang.seoName]) {
                    cascadeProcess = true;
                }
            }
        }

        if (changed('permissions.inherits') || (changed('permissions.roles') && !_.isEmpty(_.difference(previous.permissions.roles, self.permissions.roles)))) {
            cascadeProcess = true;
        }


        if (hierarchyChange) {
            self.hierarchy = node.getHierarchy(self).slice(0);
            self.config.computed = true;
            dpd.nodes.put(self.id, self);
        }

        node.materialize(self);

        if (cascadeProcess) {
            processChildren(self);
        }

        if (!internal)
            emit('nodeUpdated', self);
    }
};

var processChildren = function (nodeObj) {
    dpd.nodes.get({ domain: nodeObj.domain, parent: nodeObj.id }, function (results, error) {
        if (error) {
            throw error;
        }
        else {
            _.each(results, function (result) { 
                var newHierarchy = nodeObj.hierarchy.slice(0);
                newHierarchy.push(result.id);

                result.hierarchy = newHierarchy;
                result.config.computed = true;

                dpd.nodes.put(result.id, result);

                dpdSync.wrap(node.materialize, result);
                processChildren(result);
            });
        }
    });
};

dpdSync.wrap(processFn);