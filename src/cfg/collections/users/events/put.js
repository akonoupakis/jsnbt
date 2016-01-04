var _ = require('underscore');

module.exports = function (sender, context, data) {

    if (context.internal)
        return context.done();

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    
    if (!context.internal && data.password) 
        return context.error(401, 'cannot set password');

    if (context.req.session.user && context.req.session.user.id === data.id) {
        if (context.changed('roles')) {
            return context.error(401, 'cannot assign own roles');
        }
    }
    else {
        if (!context.internal && !authMngr.isAuthorized(context.req.session.user, 'users', 'U'))
            return context.error(401, 'access denied');

        if (context.changed('roles')) {
            if (data.roles.length === 0) {
                return context.error(400, 'at least one role is required');
            }

            _.each(data.roles, function (role) {
                if (!authMngr.isInRole(context.req.session.user, role)) {
                    return context.error(401, 'access denied for role "' + role + '"');
                }
            });
        }
    }

    if (data.password)
        return context.error(401, 'cannot set password');

    context.done();

};