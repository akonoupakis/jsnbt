var app = requireApp('app.js');
var user = requireApp('user.js');

var _ = require('underscore');

var self = this;

app.anyUsers = app.anyUsers || false;

if (!app.anyUsers) {
    if (self.roles.length === 0) {
        error('roles', 'at least one role is required');
    }
    else if (self.roles.indexOf('sa') === -1) {
        error('roles', 'first time user should be on the "sa" role');
    }

    app.anyUsers = true;

    emit('userCreated', self);
}
else {
    if (!user.isAuthorized(me, 'users', 'C'))
        cancel('access denied', 500);
    else if (self.roles.length === 0) {
        error('roles', 'at least one role is required');
    }

    _.each(self.roles, function (role) {
        if (me.roles.indexOf(role) === -1) {
            error('roles', 'access denied for role "' + role + '"');
        }
    });

    emit('userCreated', self);
}