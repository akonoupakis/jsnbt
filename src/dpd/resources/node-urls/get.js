var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'nodeurls', 'R'))
    cancel('access denied', 500);