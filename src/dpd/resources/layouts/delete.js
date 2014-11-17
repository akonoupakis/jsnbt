var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'layouts', 'D'))
    cancel('access denied', 500);