var hosts = require('./hosts.json');
var app = require('jsnbt-docs');

var server = app.createServer({
    title: 'jsnbt documentation',
    host: hosts.docs.host,
    port: hosts.docs.port,
    root: 'docs'
});

server.start();