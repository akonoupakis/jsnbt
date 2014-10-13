var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'U'))
    cancel('access denied', 500);

self.modifiedOn = new Date().getTime();

if (!internal)
    emit('dataUpdated', self);