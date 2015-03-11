var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'layouts', 'R'))
    cancel('access denied', 500);