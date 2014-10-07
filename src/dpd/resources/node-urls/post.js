var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'nodeurls', 'C'))
    cancel('access denied', 500);

if (!internal)
    emit('nodeurlCreated', self);
