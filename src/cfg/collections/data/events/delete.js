module.exports = function (sender, context, data) {

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    
    if (!context.internal && !authMngr.isAuthorized(context.req.session.user, 'data:' + data.domain + ':' + data.list, 'D'))
        return context.error(401, 'Access denied');

    context.done();

};