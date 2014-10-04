var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'texts', 'R'))
    cancel('access denied', 500);