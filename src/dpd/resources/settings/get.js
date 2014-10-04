var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'settings', 'R'))
    cancel('access denied', 500);