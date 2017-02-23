var Server = require('./docs.js');

var server = new Server({
    web: {
        host: process.env.HOSTS_DOCS_HOST,
        port: parseInt(process.env.HOSTS_DOCS_PORT)
    }
});

server.start();