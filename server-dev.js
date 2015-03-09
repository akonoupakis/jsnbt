var hosts = require('./hosts.js');
var app = require('./src/app/app.js');
var dbgIndex = require('./src/app/dbg/index.js');

app.init('dev', hosts, dbgIndex);
app.start('jsnbt dev');