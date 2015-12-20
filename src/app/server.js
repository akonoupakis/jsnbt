var http = require('http');
var database = require('./database');
var util = require('util');
var sessionFile = require('./session');
var SessionStore = require('./session').SessionStore;
var io = require('socket.io');
var extend = require('extend');
var async = require('async');
var serverRoot = require('server-root');
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
    
    sessionFile.appPath = __dirname;
    
    var started = false;

    this.stores = {};

    this.db = database.create(options.db);

    this.cache = require('./cache.js')();

    this.sockets = io.listen(this, {
        'log level': 0
    }).sockets;
    
    this.sessions = new SessionStore('sessions', this.db, this.sockets);

    if (options.events)
        for (var item in options.events)
            this.on(item, options.events[item]);

    this.on('listening', function () {
        server.host = optsHost;
        server.port = server.options.port;
        
        logger.info('jsnbt server is listening on:' + server.options.port);

        started = true;

        if (server.next)
            server.next();
    });

    this.on('request', function (req, res) {
        if (started) {
            server.route(req, res);
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
}
util.inherits(Server, http.Server);

var getResources = function (server, cb) {
   
    var resources = [];
    var asyncFns = [];

    Object.keys(server.app.config.collections).forEach(function (collectionName) {

        var collectionConfig = server.app.config.collections[collectionName];

        asyncFns.push(function (fn) {
            var rType = collectionConfig.users ? require('./data/user-collection.js') : require('./data/collection.js');
            var resource = new rType(server, collectionConfig);
            resources.push(resource);

            if (resource.load) {
                resource.load(function () {
                    fn();
                });
            } else {
                fn();
            }
        });

    });

    async.series(asyncFns, function (err, results) {
        cb(err, resources);
    });
};

Server.prototype.start = function (next) {
    var server = this;

    getResources(server, function (err, resources) {
        if (err) {
            console.error();
            console.error("Error loading resources: ");
            console.error(err.stack || err);
            process.exit(1);
        } else {
            server.resources = resources;
            http.Server.prototype.listen.call(server, server.options.port, server.options.host);

            if (typeof (next) === 'function') {
                server.next = next;
            }
            //else {
                //server.next = undefined;
            //}
        }

    });
};

Server.prototype.route = function route(req, res) {
    var server = this;

    if (req.url.indexOf('/socket.io/') === 0) 
        return;

    var router = new require('./router.js')(server, req, res);
    router.process();
};

Server.prototype.createStore = function (namespace) {
    return (this.stores[namespace] = this.db.createStore(namespace));
};

module.exports = function (app, options) {
    return new Server(app, options);
};