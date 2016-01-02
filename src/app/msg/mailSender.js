var extend = require('extend');
var emailjs = require("emailjs");
var _ = require('underscore');

var MailSender = function (settings) {
    this.settings = settings;
};

MailSender.prototype.send = function (options, callback) {

    var defOpts = {
        from: this.settings.sender,
        to: '',
        subject: '',
        body: ''
    };

    var opts = {};
    extend(true, opts, defOpts, options);

    var mailServer = emailjs.server.connect({
        host: this.settings.host,
        user: this.settings.username,
        password: this.settings.password,
        ssl: this.settings.ssl
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
};

module.exports = function (settings) {
    return new MailSender(settings);
};