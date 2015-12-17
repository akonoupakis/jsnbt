exports.domain = 'core';
exports.browsable = false;
exports.messager = true;

exports.getName = function () {
    return require('../../package').name;
};

exports.getVersion = function () {
    return require('../../package').version;
};

exports.getConfig = function () {
    return require('../cfg/config.js');
};

exports.getBower = function () {
    return require('../web/bower.json');
};