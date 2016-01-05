module.exports = function (sender, context, data) {

    if (context.internal) 
        return context.done();

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);

    if (data.id) {

        if (!authMngr.isAuthorized(context.req.session.user, 'data:' + data.domain + ':' + data.list, 'R'))
            return context.error(401, 'Access denied');

        if (!authMngr.isInRole(context.req.session.user, 'admin')) {
            context.hide('createdOn');
            context.hide('modifiedOn');
        }

    }

    context.done();

};