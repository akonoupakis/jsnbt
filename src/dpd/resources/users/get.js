var app = requireApp('app.js');
var authMngr = requireApp('cms/authMngr.js')(server);

var self = this;

if (app.anyUsers) {
    if (!me) {
        cancel('Access denied', 500);
    }
    else if (me.id !== self.id) {
        if (!internal && !authMngr.isAuthorized(me, 'users', 'R'))
            cancel('Access denied', 500);
    }
}