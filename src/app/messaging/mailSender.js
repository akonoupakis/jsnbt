var _ = require('underscore');

module.exports = function (settings, dpd) {

    return {

        send: function (options, success, error) {

            var defOpts = {
                from: settings.sender,
                to: '',
                subject: '',
                body: ''
            };

            var opts = {};
            _.extend(opts, defOpts);
            _.extend(opts, options);

            success();
        }

    };

};