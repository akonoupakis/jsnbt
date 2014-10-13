var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodeurls', 'D'))
    cancel('access denied', 500);

if (!internal)
    emit('nodeurlDeleted', self);