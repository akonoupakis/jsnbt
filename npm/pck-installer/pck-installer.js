var pack = require('../../app/package.js');

exports.install = function (name) {
     pack.npm.pack(name, true);
};
exports.uninstall = function (name) {
    pack.npm.unpack(name);
};