var config = require('./config.js');
var app = require('./src/app/app.js');
var argv = require('argv');

var args = argv.option({
    name: 'env',
    short: 'e',
    type: 'string',
    description: 'Defines the target environment, dev or prod',
    example: "'script --env=dev' or 'script -e dev'"
}).run(process.argv);

var env = 'dev';
if (args.options.env)
    if (['dev', 'prod'].indexOf(args.options.env.toLowerCase()) != -1)
        env = args.options.env;

process.chdir(env === 'prod' ? 'dist' : 'dev');

app.init(env, config);
app.start();