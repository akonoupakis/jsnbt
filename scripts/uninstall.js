var config = require('../package');
var installer = require('../installer.js')

console.log('uninstalling ' + config.name + ' v' + config.version);
installer.npm.unpack(config.name);
console.log('uninstalled ' + config.name + ' v' + config.version);