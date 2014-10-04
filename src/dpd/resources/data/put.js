var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'data', 'U'))
    cancel('access denied', 500);

self.modifiedOn = new Date().getTime();

emit('dataUpdated', self);