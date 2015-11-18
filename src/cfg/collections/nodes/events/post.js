var authMngr = requireApp('cms/authMngr.js')(server);
var node = requireApp('cms/nodeMngr.js')(server, db);

var _ = require('underscore');

var self = this;

if (!internal && !authMngr.isAuthorized(me, 'nodes:' + self.entity, 'C'))
    cancel('Access denied', 401);
    
var entity = requireApp('cms/entityMngr.js')(server, self.entity);

if (entity.hasProperty('seo')) {
    db.nodes.get({ parent: self.parent, domain: self.domain, id: { $nin: [self.id] } }, function (siblingNodesError, siblingNodes) {
        if (siblingNodesError)
            throw siblingNodesError;
        else {
            for (var lang in self.seo) {
                if (self.active[lang]) {
                    var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.seo[lang]; }), 'seo'), lang);
                    if (siblingSeoNames.indexOf(self.seo[lang]) !== -1) {
                        cancel('seo name already exists', 400);
                    }
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