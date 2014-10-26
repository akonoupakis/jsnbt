var app = requireApp('app.js');
var auth = requireApp('auth.js');

var _ = require('underscore');

var self = this;

var anyUsers = function (cb) {
    if (app.anyUsers !== undefined) {
        cb(app.anyUsers);
    }
    else {
        dpd.users.get({}, function (users) {
            app.anyUsers = users.length > 0;
            cb(app.anyUsers);
        });
    }
};

anyUsers(function (anyUsersResult) {

    if (!anyUsersResult) {
        if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }
        else if (self.roles.indexOf('sa') === -1) {
            error('roles', 'first time user should be on the "sa" role');
        }

        app.anyUsers = true;

        if (!internal)
            emit('userCreated', self);
    }
    else {
        if (!internal && !auth.isAuthorized(me, 'users', 'C'))
            cancel('access denied', 500);
        else if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (!auth.isInRole(me, role)) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });

        if (!internal)
            emit('userCreated', self);
    }

});