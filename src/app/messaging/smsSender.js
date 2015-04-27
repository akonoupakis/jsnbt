var extend = require('extend');
var _ = require('underscore');

module.exports = function (settings) {

    return {

        send: function (options, callback) {
            var defOpts = {
                from: settings.sender,
                to: '',
                subject: '',
                body: ''
            };

            var opts = {};
            extend(true, opts, defOpts, options);

            callback(new Error('not implemented'), null);
        }

    };

};