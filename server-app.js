var hosts = require('./hosts.json');
var app = require('./src/app/app.js');

app.init();

var server = app.createServer({
    host: hosts.host,
    port: hosts.port,
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jsnbt-dev'
    }
});

server.start();