var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'settings', 'D'))
    cancel('access denied', 500);

emit('settingDeleted', self);