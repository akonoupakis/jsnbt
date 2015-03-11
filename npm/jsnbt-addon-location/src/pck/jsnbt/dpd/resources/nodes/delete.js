var auth = requireApp('auth.js');
var cache = requireApp('cache.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodes', 'D'))
    cancel('access denied', 500);

cache.purge(self.id);

if (!internal)
    emit('nodeDeleted', self);