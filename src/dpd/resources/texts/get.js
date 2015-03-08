var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'texts', 'R'))
    cancel('access denied', 500);