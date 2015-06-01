var authMngr = requireApp('cms/authMngr.js')(server);
var _ = require('underscore');

var self = this;

if (me && me.id == self.id) {
    if (changed('roles') && !_.isEmpty(_.difference(previous.roles, self.roles))) {
        error('roles', 'cannot assign own roles');
    }
}
else {
    if (!internal && !authMngr.isAuthorized(me, 'users', 'U'))
        cancel('access denied', 500);

    if (changed('roles') && !_.isEmpty(_.difference(previous.roles, self.roles))) {
        if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (!authMngr.isInRole(me, role)) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });
    }
}