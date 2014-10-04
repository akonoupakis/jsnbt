var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'languages', 'R'))
    cancel('access denied', 500);