var hosts = require('./hosts.js');
var app = require('./src/app/app.js');

app.init('dev', hosts);
app.start('jsnbt dev');