var hosts = require('./hosts.json');
var app = require('jsnbt-docs');

var server = app.createServer({
    title: 'jsnbt documentation',
    host: hosts.host,
    port: hosts.port + 1,
    root: 'docs'
});

server.start();