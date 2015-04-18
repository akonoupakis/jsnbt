var config = require('../package');
var npm = require('../src/util/npm.js')

console.log('installing ' + config.name + ' v' + config.version);
npm.pack(config.name, true);
console.log('installed ' + config.name + ' v' + config.version);