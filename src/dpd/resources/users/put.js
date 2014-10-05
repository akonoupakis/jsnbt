var user = requireApp('user.js');
var _ = require('underscore');

var self = this;

if (me && me.id == self.id) {
    if (changed('roles') && !_.isEmpty(_.difference(previous.roles, self.roles))) {
        console.log('prev', previous.roles);
        console.log('self', self.roles);
        error('roles', 'cannot assign own roles');
    }
    emit('userUpdated', self);
}
else {
    if (!user.isAuthorized(me, 'users', 'U'))
        cancel('access denied', 500);

    if (changed('roles') && !_.isEmpty(_.difference(previous.roles, self.roles))) {
        if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (!user.isInRole(me, role)) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });

        emit('userUpdated', self);
    }
}