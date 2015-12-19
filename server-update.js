var hosts = require('./hosts.json');
var app = new require('./app')();

app.init();

var server = app.createServer({
    host: hosts.upd.host,
    port: hosts.upd.port,
    db: {
        host: hosts.db.host,
        port: hosts.db.port,
        name: hosts.db.name
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