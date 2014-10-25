var auth = requireApp('auth.js');
var node = requireApp('node.js');

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'R')) {
    cancel('access denied', 500);
}

if (!internal) {
    dpd.nodes.get({ id: { $in: self.hierarchy } }, function (results, error) {
        var hierarchyNodes = [];

        var allHierarchyNodes = true;

        _.each(self.hierarchy, function (selfHierarchy) {
            var hNode = _.first(_.filter(results, function (x) { return x.id == selfHierarchy; }));
            if (hNode)
                hierarchyNodes.push(hNode);
            else {
                allHierarchyNodes = false;
                return false;
            }
        });

        self.url = {};

        if (allHierarchyNodes) {
            self.url = node.getHierarchyUrl(hierarchyNodes);
        }
    });

    hide('config');

    if (!auth.isInRole(me, 'admin')) {
        hide('permissions');
    }
}

