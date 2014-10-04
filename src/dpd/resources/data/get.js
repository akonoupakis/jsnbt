var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'data', 'R'))
    cancel('access denied', 500);