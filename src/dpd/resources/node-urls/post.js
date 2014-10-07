var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'nodeurls', 'C'))
    cancel('access denied', 500);

emit('nodeurlCreated', self);