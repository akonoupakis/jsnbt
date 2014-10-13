var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodeurls', 'C'))
    cancel('access denied', 500);

if (!internal)
    emit('nodeurlCreated', self);
