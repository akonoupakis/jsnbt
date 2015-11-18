var authMngr = requireApp('cms/authMngr.js')(server);

var self = this;

self.createdOn = new Date().getTime();

if (!internal && !authMngr.isAuthorized(me, 'data:' + self.domain + ':' + self.list, 'C'))
    cancel('Access denied', 401);