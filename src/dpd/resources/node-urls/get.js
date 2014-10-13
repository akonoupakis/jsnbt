var auth = requireApp('auth.js');

var self = this;

if (!internal && !auth.isAuthorized(me, 'nodeurls', 'R'))
    cancel('access denied', 500);

if (!internal) {

    self.id = self.nodeId;
    delete self.nodeId;

    hide('permissions');
    hide('secure');
    hide('view');
}
