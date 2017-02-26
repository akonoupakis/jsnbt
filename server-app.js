var config = require('./config.json');
var Server = require('./server.js');

const hosts = {
    web: {
        host: process.env.HOSTS_WEB_HOST,
        port: parseInt(process.env.HOSTS_WEB_PORT)
    },
    db: {
        host: process.env.HOSTS_DB_HOST,
        port: parseInt(process.env.HOSTS_DB_PORT),
        name: process.env.HOSTS_DB_NAME
    }
};

var server = new Server(hosts, config);

server.start();