var dpdSync = require('dpd-sync');
var auth = requireApp('auth.js');
var node = requireApp('node.js');

var self = this;

var processFn = function () {
    if (!internal && !auth.isAuthorized(me, 'nodes', 'C'))
        cancel('access denied', 500);

    if (matchedCode && matchedCode !== '') {
        var matchedCode = dpdSync.call(dpd.nodes.get, { code: self.code, domain: self.domain });
        if (matchedCode.length > 0)
            cancel('node code already exists', 400);
    }

    var seoNamesChanged = false;
    for (var lang in self.data.localized) {
        if (previous.data.localized && previous.data.localized[lang]) {
            if (self.data.localized[lang].seoName !== previous.data.localized[lang].seoName) {
                seoNamesChanged = true;
            }
        }
    }

    if (seoNamesChanged) {
        var siblingNodes = dpdSync.call(dpd.nodes.get, { parent: self.parent, domain: self.domain, id: { $nin: [self.id] } });
        for (var lang in self.data.localized) {
            var siblingSeoNames = _.pluck(_.pluck(_.pluck(_.pluck(_.filter(siblingNodes, function (x) { return x.data && x.data.localized && x.data.localized[lang]; }), 'data'), 'localized'), lang), 'seoName');
            if (siblingSeoNames.indexOf((self.data.localized[lang] || {}).seoName) === -1) {
                cancel('seo name already exists', 400);
            }            
        }
        
    }

    self.createdOn = new Date().getTime();
    self.modifiedOn = new Date().getTime();

    self.hierarchy = node.getHierarchy(self).slice(0);
    self.config.computed = true;
    dpd.nodes.put(self.id, self);
    
    node.materialize(self);

    if (!internal)
        emit('nodeCreated', self);
};

dpdSync.wrap(processFn);