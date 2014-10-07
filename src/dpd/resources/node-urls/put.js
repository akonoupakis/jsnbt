var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'nodeurls', 'U'))
    cancel('access denied', 500);

if (!internal)
    emit('nodeurlUpdated', self);