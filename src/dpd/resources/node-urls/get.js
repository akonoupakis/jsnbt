var user = requireApp('user.js');

var self = this;

if (!internal && !user.isAuthorized(me, 'nodeurls', 'R'))
    cancel('access denied', 500);

if (!internal) {

    self.id = self.nodeId;
    delete self.nodeId;

    hide('permissions');
    hide('secure');
    hide('view');

    //console.log('getting', self.id);
    self.test = 'test';
}
