var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'C'))
    cancel('access denied', 500);
    
var entity = requireApp('entity.js')(self.entity);
if (!entity)
    error('entity', 'not a known entity');

if (entity.hasProperty('seo')) {
    dpd.nodes.get({ parent: self.parent, domain: self.domain, id: { $nin: [self.id] } }, function (siblingNodes, siblingNodesError) {
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
    
if (!internal)
    emit('nodeCreated', self);