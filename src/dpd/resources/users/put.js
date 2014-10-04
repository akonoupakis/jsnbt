var user = requireApp('user.js');

var self = this;

if (me && me.id == self.id) {
    if(changed('roles'))
        error('roles', 'cannot assign own roles');

    emit('userUpdated', self);
}
else {
    if (!user.isAuthorized(me, 'users', 'U'))
        cancel('access denied', 500);

    if (changed('roles'))
    {
        if (self.roles.length === 0) {
            error('roles', 'at least one role is required');
        }

        _.each(self.roles, function (role) {
            if (me.roles.indexOf(role) === -1) {
                error('roles', 'access denied for role "' + role + '"');
            }
        });

        emit('userUpdated', self);
    }
}