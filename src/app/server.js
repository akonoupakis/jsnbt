var http = require('http');
var Router = require('./routerServer');
var db = require('./db');
var util = require('util');
var Keys = require('./keys');
var sessionFile = require('./session');
var SessionStore = require('./session').SessionStore;
var io = require('socket.io');
var extend = require('extend');
var setupReqRes = require('./util/http').setup;
var debug = require('debug')('server');
var config = require('./config-loader');

var serverRoot = require('server-root');
var validation = require('json-validation');
var fs = require('fs');
var _ = require('underscore');

var logger = require('./logger.js')(this);

function Server(app, options) {
    var server = process.server = this;
    http.Server.call(this);

    var optsHost = options.host;
    if (options.host)
        delete options.host;

    this.options = {
        host: 'localhost',
        port: 2403,
        db: {
            port: 27017,
            host: '127.0.0.1',
            name: 'deployd'
        }
    };

    extend(true, this.options, options);

    debug('started with options %j', options);

    sessionFile.appPath = __dirname;

    var authMngr = null;

    var started = false;

    var logAction = function (dpd, user, collection, action, objectId, objectData, callback) {

        if (server.app.config.collections[collection]) {
            if (server.app.config.collections[collection].logging) {

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

    this.stores = {};

    this.db = db.create(options.db);

    this.cache = require('./cache.js')();

    if (options.cache)
        this.cache = options.cache;

    this.setCache = function (cache) {
        sSelf.cache = cache;
    };

    this.sockets = io.listen(this, {
        'log level': 0
    }).sockets;

    this.dpd = {
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
            if (server.app.config.collections[collection]) {
                if (server.app.config.collections[collection].schema) {
                    var validator = new validation.JSONValidation();
                    var validationResult = validator.validate(object, server.app.config.collections[collection].schema);
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
    };

    this.sessions = new SessionStore('sessions', this.db, this.sockets);

    this.keys = new Keys();

    if (options.events)
        for (var item in options.events)
            this.on(item, options.events[item]);

    this.on('listening', function () {
        server.host = optsHost;
        server.port = server.options.port;

        authMngr = require('./cms/authMngr.js')(server);

        logger.info('jsnbt server is listening on:' + server.options.port);

        started = true;

        if (server.next)
            server.next();
    });

    this.on('request', server.handleRequest);

    this.on('request', function (req, res) {
        if (started) {
            var router = new require('./router.js')(server, req, res);
            router.process();
        }
        else {
            req._routed = true;
            res.write('503 - Service is starting'); 
            res.end();
        }
    });

    this.on("request:error", function (err, req, res) {
        logger.error(req.method, req.url, err.stack || err);
        process.exit(1);
    });

    server.getPath = serverRoot.getPath;

    server.messager = require('./messager.js')(server);

    server.app = app;

    var versionInfo = fs.existsSync(serverRoot.getPath('node_modules/jsnbt/package.json')) ?
        require(serverRoot.getPath('node_modules/jsnbt/package.json')) :
        require(serverRoot.getPath('package.json'));

    server.version = versionInfo.version;

    server.languages = require('./storage/languages.js');
    server.countries = require('./storage/countries.js');
}
util.inherits(Server, http.Server);

Server.prototype.handleRequest = function handleRequest(req, res) {
    var server = this;

    if (req._routed)
        return;

    // dont handle socket.io requests
    if (req.url.indexOf('/socket.io/') === 0) return;

    debug('%s %s', req.method, req.url);

    // add utilites to req and res
    setupReqRes(req, res, function (err, next) {
        if (err) return res.end(err.message);

        server.sessions.createSession(req.cookies.get('sid'), function (err, session) {

            if (err) {
                debug('session error', err, session);
                throw err;
            } else {
                // (re)set the session id
                req.cookies.set('sid', session.sid);
                req.session = session;

                var root = req.headers['dpd-ssh-key'] || req.cookies.get('DpdSshKey');

                if (server.options.env === 'development') {
                    if (root) { req.isRoot = true; }
                    server.route(req, res);
                } else if (root) {
                    // all root requests
                    // must be authenticated
                    debug('authenticating', root);
                    server.keys.get(root, function (err, key) {
                        if (err) throw err;
                        if (key) req.isRoot = true;
                        debug('is root?', session.isRoot);
                        server.route(req, res);
                    });
                } else {
                    // normal route
                    server.route(req, res);
                }
            }
        });
    });
};

Server.prototype.start = function (next) {
    var server = this;

    config.loadConfig('./', server, function (err, resourcesInstances) {
        if (err) {
            console.error();
            console.error("Error loading resources: ");
            console.error(err.stack || err);
            process.exit(1);
        } else {
            server.resources = resourcesInstances;
            var router = new Router(resourcesInstances, server);
            server.router = router;
            http.Server.prototype.listen.call(server, server.options.port, server.options.host);

            if (typeof (next) === 'function') {
                server.next = next;
            }
            else {
                server.next = undefined;
            }
        }
    });
};

Server.prototype.route = function route(req, res) {
    var server = this;

    config.loadConfig('./', server, function (err, resourcesInstances) {
        if (err) throw err;
        var router = new Router(resourcesInstances, server);
        server.router = router;

        server.resources = resourcesInstances;
        router.route(req, res);
    });
};

Server.prototype.createStore = function (namespace) {
    return (this.stores[namespace] = this.db.createStore(namespace));
};


module.exports = function (app, options) {

    return new Server(app, options);

};