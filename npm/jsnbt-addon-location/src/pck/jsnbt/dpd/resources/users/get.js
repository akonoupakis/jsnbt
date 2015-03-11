var app = requireApp('app.js');
var auth = requireApp('auth.js');

var self = this;

if (app.anyUsers) {
    if (!me) {
        cancel('Access denied', 500);
    }
    else if (me.id !== self.id) {
        if (!internal && !auth.isAuthorized(me, 'users', 'R'))
            cancel('Access denied', 500);
    }
}