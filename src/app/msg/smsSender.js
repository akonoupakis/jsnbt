var extend = require('extend');
var _ = require('underscore');

var SmsSender = function (settings) {
    this.settings = settings;
};

SmsSender.prototype.send = function (options, callback) {
    var defOpts = {
        from: this.settings.sender,
        to: '',
        subject: '',
        body: ''
    };

    var opts = {};
    extend(true, opts, defOpts, options);

    callback(new Error('not implemented'), null);
};

module.exports = function (settings) {
    return new SmsSender(settings);
};