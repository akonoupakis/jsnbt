var config = require('./config.js');
var app = require('./src/app/app.js');

app.init('dev', config);
app.start();