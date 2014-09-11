var config = require('../package');
var pack = require('../app/package.js')

console.log('uninstalling ' + config.name + ' v' + config.version);
pack.npm.unpack(config.name);
console.log('uninstalled ' + config.name + ' v' + config.version);