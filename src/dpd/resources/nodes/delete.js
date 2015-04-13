var auth = requireApp('auth.js');
var node = requireApp('node.js')(dpd);

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'D'))
    cancel('access denied', 500);

node.purgeCache(self.id);

if (!internal)
    emit('nodeDeleted', self);