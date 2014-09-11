var config = require('./config.js');
var app = require('./app/app.js');
var dpdSync = require('dpd-sync');
var argv = require('argv');

var args = argv.option([{
    name: 'env',
    short: 'e',
    type: 'string',
    description: 'Defines the target environment, dev or prod',
    example: "'script --env=dev' or 'script -e dev'"
}, {
    name: 'module',
    short: 'm',
    type: 'string',
    description: 'Defines the target module script',
    example: "'script --module=./data/main.js' or 'script -m ./data/main.js'"
}]).run(process.argv);

var env = 'dev';
if (args.options.env)
    if (['dev', 'prod'].indexOf(args.options.env.toLowerCase()) != -1)
        env = args.options.env;

process.chdir(env === 'prod' ? 'dist' : 'dev');

app.init(env);
app.start();

app.server.on('listening', function () {
    var mod = require(args.options.module);
    dpdSync.wrap(mod, app.dpd);
});