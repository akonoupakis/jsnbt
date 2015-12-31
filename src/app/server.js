var express = require('express');
var http = require('http');
var dbproxy = require('mongodb-proxy');
var util = require('util');
var session = require('./session');
var io = require('socket.io');
var extend = require('extend');
var async = require('async');
var serverRoot = require('server-root');
var _ = require('underscore');

var logger = require('./logger.js')(this);

function Server(app, options) {
    var self = this;

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
    
    session.appPath = __dirname;
        
    this.db = dbproxy.create(this.options.db);

    this.db.configure(function (config) {

        for (var collectionName in app.config.collections) {
            config.register(app.config.collections[collectionName]);
        }

    });

    this.host = optsHost;
    this.port = this.options.port;

    this.getPath = serverRoot.getPath;

    this.messager = require('./messager.js')(this);

    this.app = app;

    this.express = express();
}
Server.prototype = Object.create(express.prototype);

Server.prototype.start = function () {
    var self = this;

    var serv = this.express.listen(this.options.port);

    this.sockets = io.listen(serv, {
        'log level': 0
    }).sockets;

    this.sessions = session.createStore('sessions', this.db, this.sockets);
    
    var router = new require('./router.js')(self, self.express);
    router.start();
    
    logger.info('jsnbt server is listening on:' + self.options.port);
};

module.exports = function (app, options) {
    return new Server(app, options);
};