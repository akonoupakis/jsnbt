var hosts = require('./hosts.js');
var app = require('./src/app/app.js');

app.init('prod', hosts);
app.start();