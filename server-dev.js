var hosts = require('./hosts.json');
var app = require('./src/app/app.js');
var dbgSite = require('./src/dbg/index.js');

app.init({
    title: 'jsnbt - dev'
}, dbgSite);

var server = app.createServer({
    env: 'dev',
    host: hosts.host,
    port: hosts.port,
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jsnbt-dev'
    }
});

server.start();