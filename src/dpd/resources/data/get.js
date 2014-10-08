var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'R'))
    cancel('access denied', 500);