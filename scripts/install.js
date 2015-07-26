var packInfo = require('../package');
var installer = require('../installer.js')

console.log('installing ' + packInfo.name + ' v' + packInfo.version);
installer.npm.pack(packInfo.name, true);
console.log('installed ' + packInfo.name + ' v' + packInfo.version);