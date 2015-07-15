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

function Server(options) {
    var server = process.server = this;
    http.Server.call(this);

    // defaults
    this.options = {
        port: 2403,
        db: { port: 27017, host: '127.0.0.1', name: 'deployd' },
        dpd: {
            onPreRead: function (scriptContext, collection, callback) {
                callback();
            },
            onPostRead: function (scriptContext, collection, object, callback) {
                callback();                
            },
            onPreCreate: function (scriptContext, collection, callback) {
                callback();
            },
            onPostCreate: function (scriptContext, collection, object, callback) {
                callback();
            },
            onPreUpdate: function (scriptContext, collection, object, callback) {
                callback();
            },
            onPostUpdate: function (scriptContext, collection, object, callback) {
                callback();
            },
            onPreDelete: function (scriptContext, collection, object, callback) {
                callback();
            },
            onPostDelete: function (scriptContext, collection, object, callback) {
                callback();
            },
            onValidate: function (scriptContext, collection, object, callback) {
                callback();
            }
        }
    };

    extend(true, this.options, options);

    debug('started with options %j', options);

    sessionFile.appPath = options.appPath;

    // an object to map a server to its stores
    this.stores = {};

    // back all memory stores with a db
    this.db = db.create(options.db);

    this.cache = require('./cacheServer.js')();

    if (options.cache)
        this.cache = options.cache;

    this.setCache = function (cache) {
        sSelf.cache = cache;
    };

    // use socket io for a session based realtime channel
    this.sockets = io.listen(this, {
        'log level': 0
    }).sockets;

    this.dpd = this.options.dpd;
    
    // persist sessions in a store
    var sessionStore = this.sessions = new SessionStore('sessions', this.db, this.sockets);

    // persist keys in a store
    var keys = this.keys = new Keys();

    if (options.events)
        for (var item in options.events)
            this.on(item, options.events[item]);

    this.on('request', server.handleRequest);

    server.on('request:error', function (err, req, res) {
        console.error(req.method, req.url, err.stack || err);
        process.exit(1);
    });
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

Server.prototype.listen = function (port, host) {
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
            http.Server.prototype.listen.call(server, port || server.options.port, host || server.options.host);
        }
    });
    return this;
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

module.exports = Server;