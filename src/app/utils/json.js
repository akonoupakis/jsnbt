var app = require('../app.js');

exports.stringify = function (obj) {
    return JSON.stringify(obj, null, app.dbg ? '\t' : '');
};