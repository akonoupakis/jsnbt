var config = require('../package');
var npm = require('../src/util/npm.js')

console.log('uninstalling ' + config.name + ' v' + config.version);
npm.unpack(config.name);
console.log('uninstalled ' + config.name + ' v' + config.version);