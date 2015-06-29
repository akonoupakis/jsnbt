var app = require('jsnbt-docs');

var server = app.createServer({
    title: 'jsnbt documentation',
    host: 'localhost',
    port: 3001,
    root: 'docs'
});

server.start();