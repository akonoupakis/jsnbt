var dpdSync = require('dpd-sync');
var auth = requireApp('auth.js');
var node = requireApp('node.js');

var self = this;

var processFn = function () {
    if (!internal && !auth.isAuthorized(me, 'nodes', 'C'))
        cancel('access denied', 500);
    
    var seoNamesChanged = false;
    for (var lang in self.url) {
        if (self.url[lang] !== previous.url[lang]) {
            seoNamesChanged = true;
        }
    }

    if (seoNamesChanged) {
        var siblingNodes = dpdSync.call(dpd.nodes.get, { parent: self.parent, domain: self.domain, id: { $nin: [self.id] } });
        for (var lang in self.url) {
            var siblingSeoNames = _.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.url[lang]; }), 'url'), lang);
            if (siblingSeoNames.indexOf(self.url[lang]) === -1) {
                cancel('seo name already exists', 400);
            }            
        }        
    }

    self.createdOn = new Date().getTime();
    self.modifiedOn = new Date().getTime();

    self.hierarchy = node.getHierarchy(self).slice(0);
    self.config.computed = true;
    dpd.nodes.put(self.id, self);
    
     // node.materialize(self);

    if (!internal)
        emit('nodeCreated', self);
};

dpdSync.wrap(processFn);