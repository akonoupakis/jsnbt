var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic('docs')).listen(4000);