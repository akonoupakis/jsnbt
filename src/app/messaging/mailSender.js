var extend = require('extend');
var emailjs = require("emailjs");
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
            
            var mailServer = emailjs.server.connect({
                host: settings.host,
                user: settings.username,
                password: settings.password,                
                ssl: settings.ssl
            });

            var to = '';
            if (_.isString(opts.to))
                to = opts.to;
            else if (_.isArray(opts.to))
                to = opts.to.join(', ');

            var cc = '';
            if (_.isString(opts.cc))
                cc = opts.cc;
            else if (_.isArray(opts.cc))
                cc = opts.cc.join(', ');

            var bcc = '';
            if (_.isString(opts.bcc))
                bcc = opts.bcc;
            else if (_.isArray(opts.bcc))
                bcc = opts.bcc.join(', ');

            var message = {
                from: opts.from,
                to: to,
                cc: cc,
                bcc: bcc,
                subject: opts.subject,                
                attachment: [
                   { data: "<html>" + opts.body + "</html>", alternative: true }
                ]
            };

            mailServer.send(message, callback);
        }

    };

};