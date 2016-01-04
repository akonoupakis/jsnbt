var fs = require('fs');
var moment = require('moment');

var Logger = function (level) {
    this.level = level;
};

Logger.prototype.log = function (method, path, err) {
    if (typeof (method) === 'object')
        fs.appendFileSync(this.level + '.log', moment().format() + '\n' + method + '\n\n');
    else
        fs.appendFileSync(this.level + '.log', moment().format() + '-' + method + ' - ' + path + '\n' + err + '\n\n');
};

module.exports = function (level) {
    return new Logger(level);
};