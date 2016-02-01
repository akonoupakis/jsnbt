module.exports = {
    mail: {
        provider: 'default',
        settingsTmpl: 'tmpl/core/partials/mail.html',
        getSender: function (opts, callback) {
            var mailSender = require('../app/msg/mailSender.js')(opts);
            callback(null, mailSender);
        },
        templates: [{
            code: 'email-change',
            model: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'email@domain.com',
                code: 'test code'
            },
            subject: 'Email change request',
            body: 'Helllo {{ firstName }},<br /><br />the confirmation code for your email change is <b>{{ code }}</b>'
        }, {
            code: 'password-reset',
            model: {
                firstName: 'John',
                lastName: 'Doe',
                email: 'email@domain.com',
                code: 'test code'
            },
            subject: 'Password reset request',
            body: 'Helllo {{ firstName }},<br /><br />you have requested your password to be reset.<br /><br />the confirmation code for your password change is <b>{{ code }}</b>'
        }]
    }
};