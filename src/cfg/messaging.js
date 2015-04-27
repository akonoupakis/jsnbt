module.exports = {
    mail: {
        provider: 'default',
        settingsTmpl: 'tmpl/core/partials/mail.html',
        getSender: function (opts, callback) {
            var mailSender = require('../app/messaging/mailSender.js')(opts);
            callback(null, mailSender);
        }
    }
};