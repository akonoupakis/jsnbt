var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'data', 'C'))
    cancel('access denied', 500);

emit('dataCreated', self);