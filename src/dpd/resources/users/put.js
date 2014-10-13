var auth = requireApp('auth.js');
var _ = require('underscore');

var self = this;

if (me && me.id == self.id) {
    if (changed('roles') && !_.isEmpty(_.difference(previous.roles, self.roles))) {
        console.log('prev', previous.roles);
        console.log('self', self.roles);
        error('roles', 'cannot assign own roles');
    }
    if (!internal)
        emit('userUpdated', self);
}
else {
    if (!internal && !auth.isAuthorized(me, 'users', 'U'))
        cancel('access denied', 500);

    if (changed('roles') && !_.isEmpty(_.difference(previous.roles, self.roles))) {
        if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (!auth.isInRole(me, role)) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });

        if (!internal)
            emit('userUpdated', self);
    }
}