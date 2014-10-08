var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'C'))
    cancel('access denied', 500);

self.createdOn = new Date().getTime();
self.modifiedOn = new Date().getTime();

if (!internal)
    emit('dataCreated', self);