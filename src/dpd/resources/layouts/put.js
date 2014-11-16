var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'layouts', 'U'))
    cancel('access denied', 500);

// check if layout exists

if (!internal)
    emit('layoutUpdated', self);