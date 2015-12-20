var hosts = require('./hosts.json');
var config = require('./config.json');
var Server = require('./server.js');

var server = new Server({
    web: {
        host: hosts.web.host,
        port: hosts.web.port
    },
    db: {
        host: hosts.db.host,
        port: hosts.db.port,
        name: hosts.db.name
    }
}, config);

server.start();