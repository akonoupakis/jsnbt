var config = require('../package');
var pack = require('../app/package.js')

console.log('installing ' + config.name + ' v' + config.version);
pack.npm.pack(config.name, true);
console.log('installed ' + config.name + ' v' + config.version);