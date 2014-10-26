var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);

var _ = require('underscore');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'C'))
    cancel('access denied', 500);
    
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

self.createdOn = new Date().getTime();
self.modifiedOn = new Date().getTime();

node.getHierarchy(self, function (hierarchyNodes) {
    self.hierarchy = _.pluck(hierarchyNodes, 'id');
});
    
if (!internal)
    emit('nodeCreated', self);