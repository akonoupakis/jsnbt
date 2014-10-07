var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'settings', 'C'))
    cancel('access denied', 500);

if (!internal)
    emit('settingCreated', self);