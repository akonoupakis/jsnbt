var authMngr = requireApp('cms/authMngr.js')(server);

var self = this;

self.modifiedOn = new Date().getTime();

if (!internal && !authMngr.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'U'))
    cancel('Access denied', 401);