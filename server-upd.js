var Server = require('./migrator.js');

var server = new Server({
    host: process.env.HOSTS_DB_HOST,
    port: parseInt(process.env.HOSTS_DB_PORT),
    name: process.env.HOSTS_DB_NAME
});

server.start();