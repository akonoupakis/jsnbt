module.exports = function (sender, context, data) {

    var authMngr = sender.server.require('./cms/authMngr.js')(sender.server);
    var node = sender.server.require('./cms/nodeMngr.js')(sender.server);
    
    if (!context.internal && !authMngr.isAuthorized(context.req.session.user, 'nodes:' + data.entity, 'D'))
        return context.error(401, 'Access denied');

    node.purgeCache(data.id);

    context.done();

};