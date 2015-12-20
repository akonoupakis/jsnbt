module.exports = function (hosts) {

    var app = require('jsnbt-docs');

    var server = app.createServer({
        title: 'jsnbt documentation',
        host: hosts.web.host,
        port: hosts.web.port,
        root: 'docs'
    });

    return server;

}
