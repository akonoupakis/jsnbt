var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'U'))
    cancel('access denied', 500);

self.modifiedOn = new Date().getTime();

if (!internal)
    emit('dataUpdated', self);