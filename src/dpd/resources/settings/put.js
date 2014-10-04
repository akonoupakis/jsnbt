var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'settings', 'U'))
    cancel('access denied', 500);

emit('settingUpdated', self);