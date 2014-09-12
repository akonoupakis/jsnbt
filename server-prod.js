var config = require('./config.js');
var app = require('jsnbt/src/app/app.js');
var index = require('./src/app/index.js');

app.init('prod', config, index);
app.start();