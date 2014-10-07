var app = requireApp('app.js');
var dpdSync = require('dpd-sync');
var user = requireApp('user.js');

var _ = require('underscore');

var self = this;

var processFn = function () {

    if (app.anyUsers === undefined) {
        var users = dpdSync.call(dpd.users.get, {});
        app.anyUsers = users.length > 0;
    }

    if (!app.anyUsers) {
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
        if (!internal && !user.isAuthorized(me, 'users', 'C'))
            cancel('access denied', 500);
        else if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (!user.isInRole(me, role)) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });

        if (!internal)
            emit('userCreated', self);
    }

};

dpdSync.wrap(processFn);