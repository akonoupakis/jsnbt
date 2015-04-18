var app = require('./src/app/app.js');

app.init();

var server = app.createServer({
    env: 'prod',
    host: 'localhost',
    port: 3000,
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jsnbt-dev'
    }
});

server.start();