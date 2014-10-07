var dpdSync = require('dpd-sync');
var user = requireApp('user.js');
var node = requireApp('node.js');

var self = this;

var processFn = function () {
    if (!internal && !user.isAuthorized(me, 'nodes', 'C'))
        cancel('access denied', 500);

    if (matchedCode && matchedCode !== '') {
        var matchedCode = dpdSync.call(dpd.nodes.get, { code: self.code, domain: self.domain });
        if (matchedCode.length > 0)
            cancel('node code already exists', 400);
    }

    self.createdOn = new Date().getTime();
    self.modifiedOn = new Date().getTime();

    self.hierarchy = node.getHierarchy(self);

    node.materialize(self);

    if (!internal)
        emit('nodeCreated', self);
};

dpdSync.wrap(processFn);