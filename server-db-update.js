var app = require('./src/app/app.js');

app.update('dev', {
    host: 'localhost',
    port: 2999,
    db: {
        host: 'localhost',
        port: 27017,
        name: 'jsnbt-dev'
    }
});