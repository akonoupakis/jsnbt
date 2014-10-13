var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'settings', 'U'))
    cancel('access denied', 500);

if (!internal)
    emit('settingUpdated', self);