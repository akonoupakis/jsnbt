var app = requireApp('app.js');
var authMngr = requireApp('cms/authMngr.js')(server);

var _ = require('underscore');

var self = this;

var anyUsers = function (cb) {
    if (app.anyUsers !== undefined) {
        cb(app.anyUsers);
    }
    else {
        dpd.users.count({}, function (result) {
            app.anyUsers = result.count > 0;
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
    }
    else {
        if (!internal && !authMngr.isAuthorized(me, 'users', 'C'))
            cancel('access denied', 500);
        else if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (!authMngr.isInRole(me, role)) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });
    }

});