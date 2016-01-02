var logAction = function (sender, collection, action, req, res, data, callback) {

    if (sender.server.app.config.collections[collection]) {
        if (sender.server.app.config.collections[collection].logging) {

            var store = sender.createStore('actions', null, null, true);
            store.post(function(x) {
                x.data({
                    timestamp: new Date().getTime(),
                    user: req.sessionID && req.session.uid ? req.session.uid : undefined,
                    collection: collection,
                    action: action,
                    objectId: data ? data.id : undefined,
                    objectData: data
                });
            }, function (err, results) {
                if (err) 
                    return callback(err);
                
                callback();
            });
        }
        else {
            callback();
        }
    }
    else {
        callback();
    }

};

var authIgnoredCollections = ['nodes', 'data'];


module.exports.preread = function (sender, collection, context) {
    var authMngr = require('./cms/authMngr.js')(sender.server);
    if (!context.internal && authIgnoredCollections.indexOf(collection) === -1 && !authMngr.isAuthorized(context.req.session.user, collection, 'R')) {
        context.error(401, 'Access Denied');
    }
    else {
        context.done();
    }
};

module.exports.postread = function (sender, collection, context, data) {
    context.done();
};

module.exports.precreate = function (sender, collection, context, data) {
    var authMngr = require('./cms/authMngr.js')(sender.server);
    if (!context.internal && authIgnoredCollections.indexOf(collection) === -1 && !authMngr.isAuthorized(context.req.session.user, collection, 'C')) {
        context.error(401, 'Access Denied');
    }
    else {
        context.done();
    }
};

module.exports.postcreate = function (sender, collection, context, data) {
    logAction(sender, collection, 'create', context.req, context.res, data, function (err, res) {
        if (err) 
            return context.error(err);
        
        //if (!context.internal)
        //    context.emit(collection + ':created', data);

        context.done();
    });
};

module.exports.preupdate = function (sender, collection, context, data) {
    var authMngr = require('./cms/authMngr.js')(sender.server);
    if (!context.internal && authIgnoredCollections.indexOf(collection) === -1 && !authMngr.isAuthorized(context.req.session.user, collection, 'U')) {
        context.error(401, 'Access Denied');
    }
    else {
        context.done();
    }
};

module.exports.postupdate = function (sender, collection, context, data) {
    logAction(sender, collection, 'update', context.req, context.res, data, function (err, res) {
        if (err)
            return context.error(err);

        //if (!context.internal)
        //    context.emit(collection + ':updated', data);

        context.done();
    });
};

module.exports.predelete = function (sender, collection, context, data) {
    var authMngr = require('./cms/authMngr.js')(sender.server);
    if (!context.internal && authIgnoredCollections.indexOf(collection) === -1 && !authMngr.isAuthorized(context.req.session.user, collection, 'D')) {
        context.error(401, 'Access Denied');
    }
    else {
        context.done();
    }
};

module.exports.postdelete = function (sender, collection, context, data) {
    logAction(sender, collection, 'delete', context.req, context.res, data, function (err, res) {
        if (err)
            return context.error(err);

        //if (!context.internal)
        //    context.emit(collection + ':deleted', data);

        context.done();
    });
};