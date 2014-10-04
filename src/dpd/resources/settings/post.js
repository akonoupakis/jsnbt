var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'settings', 'C'))
    cancel('access denied', 500);

emit('settingCreated', self);