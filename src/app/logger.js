var fs = require('fs');
var moment = require('moment');
var _ = require('underscore');

var Logger = function (server, scope) {
    this.server = server;
    this.scope = scope;

    this.logger = require('custom-logger').config({ level: 0 });
    this.logger.new({
        debug: { event: "debug", level: 0, color: "yellow" },
        info: { color: 'cyan', level: 1, event: 'info' },
        notice: { color: 'yellow', level: 2, event: 'notice' },
        warn: { color: 'yellow', level: 3, event: 'warning' },
        error: { color: 'red', level: 4, event: 'error' },
        fatal: { color: 'red', level: 5, event: 'fatal' }
    });
};

Logger.prototype.debug = function (text) {
    this.logger.debug(text);
};

Logger.prototype.info = function (text) {
    this.logger.notice(text);
};

Logger.prototype.log = function (text) {
    this.logger.info(text);
};

Logger.prototype.warn = function (text) {
    this.logger.warn(text);
};

Logger.prototype.error = function (err) {
    this.logger.error(err);
    var errorText = _.isObject(err) ? JSON.stringify(err) : err;
    fs.appendFileSync('error.log', moment().format() + '-' + errorText + '\n\n');
};

Logger.prototype.fatal = function (err) {
    this.logger.fatal(err);
    var errorText = _.isObject(err) ? JSON.stringify(err) : err;
    fs.appendFileSync('fatal.log', moment().format() + '-' + errorText + '\n\n');
};

module.exports = function (server, scope) {
    return new Logger(server, scope);
};