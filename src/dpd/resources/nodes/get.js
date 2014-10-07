var user = requireApp('user.js');

var self = this;

if (!user.isAuthorized(me, 'nodes', 'R'))
    cancel('access denied', 500);