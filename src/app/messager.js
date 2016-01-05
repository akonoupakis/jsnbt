var extend = require('extend');
var mustache = require('mustache');
var _ = require('underscore');

var BaseMessager = function (server) {
    this.server = server;
}
BaseMessager.prototype.getTemplate = function (templateCode, callback) {
    throw new Error('not implemented');
};
BaseMessager.prototype.getModel = function (templateCode, callback) {
    throw new Error('not implemented');
};
BaseMessager.prototype.parseTemplate = function (template, model, callback)
{
    throw new Error('not implemented');
};
BaseMessager.prototype.getSender = function (callback) {
    throw new Error('not implemented');
};

var MailMessager = function () {
    BaseMessager.apply(this, arguments);
};
MailMessager.prototype = Object.create(BaseMessager.prototype);

MailMessager.prototype.getTemplate = function (templateCode, callback) {
    var template = this.server.app.config.messaging.mail.templates[templateCode];
    if (template) {
        callback(null, {
            subject: template.subject,
            body: template.body
        });
    }
    else {
        callback(new Error('mail template not found: ' + templateCode), null);
    }
};
MailMessager.prototype.getModel = function (templateCode, callback) {
    var template = this.server.app.config.messaging.mail.templates[templateCode];
    if (template) {
        callback(null, template.model || {});
    }
    else {
        callback(new Error('mail template not found: ' + templateCode), null);
    }
};
MailMessager.prototype.parseTemplate = function (template, model, callback) {
    try {
        var result = {
            subject: mustache.render(template.subject, model),
            body: mustache.render(template.body, model)
        };
        callback(null, result);
    }
    catch (err) {
        callback(err, null);
    }
};
MailMessager.prototype.getSender = function (callback) {
    var self = this;

    var settings = {
        provider: 'core',
        host: '',
        username: '',
        password: '',
        sender: '',
        cc: [],
        bcc: [],
        ssl: false
    };

    var store = self.server.db.createStore('settings');
    store.get(function (x) {
        x.query({
            domain: 'core'
        });
        x.single();
        x.cached();
    }, function (err, res) {
        if (err) {
            callback(err, null);
        }
        else {
            var opts = {};
            extend(true, opts, settings);

            if (res.data && res.data.messaging && res.data.messaging.mail)
                extend(true, opts, res.data.messaging.mail);

            if (opts.provider !== undefined && opts.provider !== null) {
                if (self.server.app.config.messaging.mail.implementations[opts.provider]) {
                    self.server.app.config.messaging.mail.implementations[opts.provider].getSender(opts, callback);
                }
                else {
                    callback(new Error('mail messager module not found: ' + opts.provider), null);
                }
            }
            else {
                callback(new Error('mail messager module not defined'), null);
            }
        }
    });

};


var SmsMessager = function () {
    BaseMessager.apply(this, arguments);
};
SmsMessager.prototype = Object.create(BaseMessager.prototype);

SmsMessager.prototype.getTemplate = function (templateCode, callback) {
    var template = this.server.app.config.messaging.sms.templates[templateCode];
    if (template) {
        callback(null, template.body);
    }
    else {
        callback(new Error('sms template not found: ' + templateCode), null);
    }
};
SmsMessager.prototype.getModel = function (templateCode, callback) {
    var template = this.server.app.config.messaging.sms.templates[templateCode];
    if (template) {
        callback(null, template.model || {});
    }
    else {
        callback(new Error('sms template not found: ' + templateCode), null);
    }
};
SmsMessager.prototype.parseTemplate = function (template, model, callback) {
    try {
        var result = mustache.render(template, model);
        callback(null, result);
    }
    catch (err) {
        callback(err, null);
    }
};
SmsMessager.prototype.getSender = function (callback) {
    var self = this;

    var settings = {
        provider: 'null',
        sender: ''
    };

    var store = self.server.db.createStore('settings');
    store.get(function (x) {
        x.query({
            domain: 'core'
        });
        x.single();
        x.cached();
    }, function (err, res) {
        if (err) {
            callback(err, null);
        }
        else {
            var first = _.first(res);

            var opts = {};
            extend(true, opts, settings);
            if (first.data && first.data.messaging && first.data.messaging.sms)
                extend(true, opts, first.data.messaging.sms);

            if (opts.provider !== undefined && opts.provider !== null) {
                if (self.server.app.config.messaging.sms.implementations[opts.provider]) {
                    self.server.app.config.messaging.sms.implementations[opts.provider].getSender(opts, callback);
                }
                else {
                    callback(new Error('sms messager module not found: ' + opts.provider), null);
                }
            }
            else {
                callback(new Error('sms messager module not defined'), null);
            }
        }
    });

};

var Messager = function (server) {
    this.server = server;

    return {

        mail: new MailMessager(server),

        sms: new SmsMessager(server)

    };

};

module.exports = Messager;