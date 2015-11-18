var authMngr = requireApp('cms/authMngr.js')(server);

var self = this;

if (!internal && !authMngr.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'D'))
    cancel('Access denied', 401);