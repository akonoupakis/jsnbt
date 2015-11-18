var authMngr = requireApp('cms/authMngr.js')(server);
var node = requireApp('cms/nodeMngr.js')(server, db);

var self = this;

if (!internal && !authMngr.isAuthorized(me, 'nodes:' + self.entity, 'D'))
    cancel('Access denied', 401);

node.purgeCache(self.id);