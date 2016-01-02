var express = require('express');
var session = require('express-session');
var dbproxy = require('mongodb-proxy');
var data = require('./data.js');
var io = require('socket.io');
var extend = require('extend');
var serverRoot = require('server-root');
var _ = require('underscore');

var logger = require('./logger.js')(this);

function Server(app, options) {
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
    
    this.db = dbproxy.create(this.options.db);
    this.db.server = this;
    
    this.db.configure(function (config) {

        for (var collectionName in app.config.collections) {
            config.register(app.config.collections[collectionName]);
        }

        config.bind('preread', data.preread);
        config.bind('postread', data.postread);
        config.bind('precreate', data.precreate);
        config.bind('postcreate', data.postcreate);
        config.bind('preupdate', data.preupdate);
        config.bind('postupdate', data.postupdate);
        config.bind('predelete', data.predelete);
        config.bind('postdelete', data.postdelete);
    });

    this.host = optsHost;
    this.port = this.options.port;

    this.getPath = serverRoot.getPath;

    this.messager = require('./messager.js')(this);

    this.app = app;

    this.express = express();
}
Server.prototype = Object.create(express.prototype);

Server.prototype.require = function () {
    var result = require.apply(require, arguments);
    return result;
}

Server.prototype.start = function () {
    var self = this;

    var server = this.express.listen(this.options.port);

    this.sockets = io.listen(server, {
        'log level': 0
    }).sockets;

    var secret = this.host + ':' + this.options.db.name + ':' + this.options.db.host + ':' + this.options.db.port;
       
    var MongoStore = require('express-session-mongo');
    var sessionStore = new MongoStore({
        db: self.options.db.name,
        ip: self.options.db.host,
        port: self.options.db.port,
        username: self.options.db.credentials && self.options.db.credentials.username,
        password: self.options.db.credentials && self.options.db.credentials.password,
        collection: 'sessions',
        fsync: false,
        native_parser: false
    });

    self.express.use(session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        store: sessionStore
    }));

    var router = new require('./router.js')(self, self.express);
    router.start();
    
    logger.info('jsnbt server is listening on:' + self.options.port);
};

module.exports = function (app, options) {
    return new Server(app, options);
};