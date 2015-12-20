var hosts = require('./hosts.json');
var Server = require('./docs.js');

var server = new Server({
    web: {
        host: hosts.docs.host,
        port: hosts.docs.port
    }
});

server.start();