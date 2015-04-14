var app = require('./src/app/app.js');
var dbgIndex = require('./src/app/dbg/index.js');

app.init('dev', {
    host: 'localhost',
    port: 3000,
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jsnbt-dev'
    }
}, dbgIndex);
app.start('jsnbt dev');