var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'R'))
    cancel('access denied', 500);