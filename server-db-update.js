var hosts = require('./hosts.json');
var app = require('./src/app/app.js');

app.init();

var server = app.createServer({
    host: hosts.host,
    port: hosts.port - 1,
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jsnbt-dev'
    }
});

server.start(function () {
    var migrator = require('./src/app/migrator.js')(server);
    migrator.process(function () {
        process.exit(0);
    }, function (err) {
        throw err;
        process.exit(1);
    });
});