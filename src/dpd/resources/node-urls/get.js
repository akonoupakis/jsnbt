var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'nodeurls', 'R'))
    cancel('access denied', 500);