var serverRoot = require('server-root');
var validation = require('json-validation');
var extend = require('extend');
var _ = require('underscore');

function Server(app, options) {

    var defOpts = {
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
        
        if (server.jsnbt.collections[collection]) {
            if (server.jsnbt.collections[collection].logging) {
                
                dpd.actions.post({
                    timestamp: new Date().getTime(),
                    user: user ? user.id : undefined,
                    collection: collection,
                    action: action,
                    objectId: objectId,
                    objectData: objectData || {}
                }, function (results, err) {
                    if (err) {
                        callback(err);
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
        db: {
            host: opts.db.host,
            port: opts.db.port,
            name: opts.db.name
        },
        dpd: {
            onPreRead: function (scriptContext, collection, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'R')) {
                    var accessDenied = new Error('access denied');
                    accessDenied.statusCode = 401;
                    callback(accessDenied);
                }
                else {
                    callback();
                }
            },
            onPostRead: function (scriptContext, collection, object, callback) {
                callback();
            },
            onPreCreate: function (scriptContext, collection, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'C')) {
                    var accessDenied = new Error('access denied');
                    accessDenied.statusCode = 401;
                    callback(accessDenied);
                }
                else {
                    callback();
                }
            },
            onPostCreate: function (scriptContext, collection, object, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'create', object.id, object, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        if (!scriptContext.internal)
                            scriptContext.emit(collection + 'Created', object);

                        callback();
                    }
                });
            },
            onPreUpdate: function (scriptContext, collection, object, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'U')) {
                    var accessDenied = new Error('access denied');
                    accessDenied.statusCode = 401;
                    callback(accessDenied);
                }
                else {
                    callback();
                }
            },
            onPostUpdate: function (scriptContext, collection, object, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'update', object.id, object, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        if (!scriptContext.internal)
                            scriptContext.emit(collection + 'Updated', object);

                        callback();
                    }
                });
            },
            onPreDelete: function (scriptContext, collection, object, callback) {
                if (!scriptContext.internal && !authMngr.isAuthorized(scriptContext.me, collection, 'D')) {
                    var accessDenied = new Error('access denied');
                    accessDenied.statusCode = 401;
                    callback(accessDenied);
                }
                else {
                    callback();
                }
            },
            onPostDelete: function (scriptContext, collection, object, callback) {
                logAction(scriptContext.dpd, scriptContext.me, collection, 'delete', object.id, object, function (err, res) {
                    if (err) {
                        callback(err);
                    }
                    else {
                        if (!scriptContext.internal)
                            scriptContext.emit(collection + 'Deleted', object);

                        callback();
                    }
                });
            },
            onValidate: function (scriptContext, collection, object, callback) {
                if (server.jsnbt.collections[collection]) {
                    if (server.jsnbt.collections[collection].schema) {
                        var validator = new validation.JSONValidation();
                        var validationResult = validator.validate(object, server.jsnbt.collections[collection].schema);
                        if (!validationResult.ok) {
                            var validationErrors = validationResult.path + ': ' + validationResult.errors.join(' - ');
                            callback(new Error(validationErrors));
                        }
                        else {
                            callback();
                        }
                    }
                    else {
                        callback();
                    }
                }
                else {
                    callback();
                }
            }
        },
        cache: require('./cache.js')(this),
        events: {
            listening: function () {
                
                server.host = opts.host;
                server.port = opts.port;

                authMngr = require('./cms/authMngr.js')(server);

                logger.info('server is listening on:' + opts.port);

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