var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'settings', 'C'))
    cancel('access denied', 500);

if (!internal)
    emit('settingCreated', self);