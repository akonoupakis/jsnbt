var app = require('./src/app/app.js');

app.init({
    title: 'jsnbt - db'
});

var server = app.createServer({
    env: 'dev',
    host: 'localhost',
    port: 2999,
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