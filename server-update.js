var hosts = require('./hosts.json');
var Server = require('./migrator.js');

var server = new Server({
    host: hosts.db.host,
    port: hosts.db.port,
    name: hosts.db.name
});

server.start();