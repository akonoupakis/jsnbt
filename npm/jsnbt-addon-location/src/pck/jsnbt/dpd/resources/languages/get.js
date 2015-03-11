var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'languages', 'R'))
    cancel('access denied', 500);