var fs = require('fs');
var moment = require('moment');

var FileLogger = function (level) {

    return {

        log: function (method, path, err) {
            if (typeof (method) === 'object')
                fs.appendFileSync(level + '.log', moment().format() + '\n' + method + '\n\n');
            else
                fs.appendFileSync(level + '.log', moment().format() + '-' + method + ' - ' + path + '\n' + err + '\n\n');
        }

    };

};

module.exports = FileLogger;