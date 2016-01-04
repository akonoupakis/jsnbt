module.exports = function (sender, context, data) {

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    
    if (!context.internal) {
        if (!context.req.session.user) {
            return context.error(401, 'Access denied');
        }

        else if (context.req.session.user.id !== data.id) {
            if (!context.internal && !authMngr.isAuthorized(context.req.session.user, 'users', 'R'))
                return context.error(401, 'Access denied');
        }
    }

    context.done();

};