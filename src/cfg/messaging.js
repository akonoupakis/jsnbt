module.exports = {
    mail: {
        provider: 'default',
        settingsTmpl: 'tmpl/core/partials/mail.html',
        getSender: function (opts, callback) {
            var mailSender = require('../app/msg/mailSender.js')(opts);
            callback(null, mailSender);
        }
    }
};