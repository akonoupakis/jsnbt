var app = requireApp('app.js');
var user = requireApp('user.js');

var self = this;

app.anyUsers = app.anyUsers || false;

if (app.anyUsers) {
    if (!me) {
        cancel('Access denied', 500);
    }
    else if (me.id !== self.id) {
        if (!user.isAuthorized(me, 'users', 'R'))
            cancel('Access denied', 500);
    }
}