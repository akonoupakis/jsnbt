var node = requireApp('cms/nodeMngr.js')(server, db);

var _ = require('underscore');

var self = this;
    
var entity = requireApp('cms/entityMngr.js')(server, self.entity);

if (entity.hasProperty('seo')) {
    db.nodes.get({ parent: self.parent, domain: self.domain, id: { $nin: [self.id] } }, function (siblingNodes, siblingNodesError) {
        if (siblingNodesError)
            throw siblingNodesError;
        else {
            for (var lang in self.seo) {
                var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.seo[lang]; }), 'seo'), lang);
                if (siblingSeoNames.indexOf(self.seo[lang]) !== -1) {
                    cancel('seo name already exists', 400);
                }
            }
        }
    });
}

self.createdOn = new Date().getTime();
self.modifiedOn = new Date().getTime();

node.getHierarchy(self, function (hierarchyNodes) {
    self.hierarchy = _.pluck(hierarchyNodes, 'id');
});