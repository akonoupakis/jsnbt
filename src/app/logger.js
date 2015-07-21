module.exports = function (scope) {

    var logger = require('custom-logger').config({ level: 0 });
    logger.new({
        debug: { event: "debug", level: 0, color: "yellow" },
        info: { color: 'cyan', level: 1, event: 'info' },
        notice: { color: 'yellow', level: 2, event: 'notice' },
        warn: { color: 'yellow', level: 3, event: 'warning' },
        error: { color: 'red', level: 4, event: 'error' },
        fatal: { color: 'red', level: 5, event: 'fatal' }
    });
    
    var errorFn = logger.error;
    logger.error = function (method, path, err) {
        require('./log/fileLogger.js')('error').log(method, path, err);        
        errorFn(method, path, err);
    };

    var fatalFn = logger.fatal;
    logger.fatal = function (method, path, err) {
        require('./log/fileLogger.js')('fatal').log(method, path, err);
        fatalFn(method, path, err);
    };

    return logger;
};