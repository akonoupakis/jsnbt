module.exports = function (sender, context, data) {

    context.error(401, 'access denied');

};

//var authMngr = requireApp('cms/authMngr.js')(server);

//var _ = require('underscore');

//var self = this;

//var anyUsers = function (cb) {
//    if (server.app.anyUsers !== undefined) {
//        cb(server.app.anyUsers);
//    }
//    else {
//        db.users.count({}, function (err, result) {
//            server.app.anyUsers = result.count > 0;
//            cb(server.app.anyUsers);
//        });
//    }
//};

//anyUsers(function (anyUsersResult) {

//    if (!anyUsersResult) {
//        if (self.roles.length === 0) {
//            error('roles', 'at least one role is required');
//        }
//        else if (self.roles.indexOf('sa') === -1) {
//            error('roles', 'first time user should be on the "sa" role');
//        }

//        server.app.anyUsers = true;
//    }
//    else {
//        if (!internal && !authMngr.isAuthorized(me, 'users', 'C'))
//            cancel('access denied', 401);
//        else if (self.roles.length === 0) {
//            error('roles', 'at least one role is required');
//        }

//        _.each(self.roles, function (role) {
//            if (!authMngr.isInRole(me, role)) {
//                error('roles', 'access denied for role "' + role + '"');
//            }
//        });
//    }

//});