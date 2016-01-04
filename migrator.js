module.exports = function (hosts) {

    var app = require('./src/app/index.js').create();

    app.init();

    var server = app.createMigrator({
        host: hosts.host,
        port: hosts.port,
        name: hosts.name
    });
    
    return server;

}
