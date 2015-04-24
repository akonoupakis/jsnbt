var serverRoot = require('server-root');
var extend = require('extend');
var _ = require('underscore');

function Server(app, options) {

    var defOpts = {
        env: 'dev',
        host: '',
        port: 0,
        db: {
            host: '',
            port: 27017,
            name: ''
        }
    };

    var opts = {};
    extend(true, opts, defOpts, options);
    
    var logger = require('./logger.js')(this);
    
    var logAction = function (dpd, user, collection, action, objectId, objectData, callback) {
        var jsnbtCollection = _.find(server.jsnbt.collections, function (x) { return x.name === collection; });
        if (jsnbtCollection) {
            if (jsnbtCollection.logging) {
                dpd.actions.post({
                    timestamp: new Date().getTime(),
                    user: user ? user.id : undefined,
                    collection: collection,
                    action: action,
                    objectId: objectId,
                    objectData: objectData || {}
                }, function (results, err) {
                    if (err) {
                        throw err;
                    }
                    else {
                        callback();
                    }
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
    
    var authMngr = null;

    var started = false;

    var server = require('deployd')({
        port: opts.port,
        env: opts.env === 'prod' ? 'production' : 'development',
        db: {
            host: opts.db.host,
            port: opts.db.port,
            name: opts.db.name
        },
        dpd: {
            onPreRead: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'R'))
                    scriptContext.cancel('access denied', 401);

                callback();
            },
            onPostRead: function (scriptContext, collection, objectId, objectData, callback) {
                callback();
            },
            onPreCreate: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'C'))
                    scriptContext.cancel('access denied', 401);

                callback();
            },
            onPostCreate: function (scriptContext, collection, objectId, objectData, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'create', objectId, objectData, function () {
                    if (!scriptContext.internal)
                        scriptContext.emit(collection + 'Created', objectData);

                    callback();
                });
            },
            onPreUpdate: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'U'))
                    scriptContext.cancel('access denied', 401);

                callback();
            },
            onPostUpdate: function (scriptContext, collection, objectId, objectData, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'update', objectId, objectData, function () {
                    if (!scriptContext.internal)
                        scriptContext.emit(collection + 'Updated', objectData);

                    callback();
                });
            },
            onPreDelete: function (scriptContext, collection, objectId, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'D'))
                    scriptContext.cancel('access denied', 401);

                callback();
            },
            onPostDelete: function (scriptContext, collection, objectId, objectData, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'delete', objectId, objectData, function () {
                    if (!scriptContext.internal)
                        scriptContext.emit(collection + 'Deleted', objectData);

                    callback();
                });
            }
        },
        cache: require('./cache.js')(this),
        events: {
            listening: function () {
                
                server.host = opts.host;
                server.port = opts.port;

                authMngr = require('./cms/authMngr.js')(server);

                logger.info('server is listening on ' + opts.host + ':' + opts.port);

                started = true;

                if (server.next)
                    server.next();

            },
            request: function (req, res) {

                if (started) {
                    var router = new require('./router.js')(server, req, res);
                    router.process();
                }
                else {
                    req._routed = true;
                    res.write('503 - Service is starting'); 
                    res.end();
                }

            },
            "request:error": function (err, req, res) {

                logger.error(req.method, req.url, err.stack || err);
                process.exit(1);

            }
        },
        appPath: __dirname
    });
        
    server.getPath = serverRoot.getPath;

    server.start = function (next) {
        server.listen();
        
        if (typeof (next) === 'function') {
            server.next = next;
        }
        else {
            server.next = undefined;
        }
    };

    server.messager = require('./messager.js')(server);

    var jsnbt = require('./jsnbt.js')();

    try {
        jsnbt.register('core', app.modules.core);
    }
    catch (err) {
        logger.error(err);
        throw err;
    }

    _.each(app.modules.rest, function (installedModule) {
        try {
            jsnbt.register(installedModule.domain, installedModule);
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    });

    if (app.modules.public) {
        try {
            jsnbt.register('public', app.modules.public);
        }
        catch (err) {
            logger.error(err);
            throw err;
        }
    }

    server.jsnbt = jsnbt;

    server.app = app;

    return server;

}

module.exports = Server;