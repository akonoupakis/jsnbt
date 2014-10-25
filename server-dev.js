var config = require('./config.js');
var app = require('./src/app/app.js');

app.init('dev', config, {
    //restricted: false
    //locale: 'el'
});
app.start('jsnbt dev');