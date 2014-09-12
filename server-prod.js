var config = require('./config.js');
var app = require('./src/app/app.js');

app.init('prod', config);
app.start();