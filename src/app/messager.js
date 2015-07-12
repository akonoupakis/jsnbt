var extend = require('extend');
var mustache = require('mustache');
var _ = require('underscore');

var Messager = function (server) {

    return {

        mail: {
            getTemplate: function (templateCode, callback) {
                var template = server.app.config.messaging.mail.templates[templateCode];
                if (template) {
                    callback(null, {
                        subject: template.subject,
                        body: template.body
                    });
                }
                else {
                    callback(new Error('mail template not found: ' + templateCode), null);
                }
            },
            getModel: function (templateCode, callback) {
                var template = server.app.config.messaging.mail.templates[templateCode];
                if (template) {
                    callback(null, template.model || {});
                }
                else {
                    callback(new Error('mail template not found: ' + templateCode), null);
                }
            },
            parseTemplate: function (template, model, callback) {
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
            },
            getSender: function (dpd, callback) {

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

                dpd.settings.getCached({
                    domain: 'core'
                }, function (res, err) {
                    if (err) {
                        callback(err, null);
                    }
                    else {
                        var first = _.first(res);

                        var opts = {};
                        extend(true, opts, settings);
                        
                        if (first.data && first.data.messaging && first.data.messaging.mail)
                            extend(true, opts, first.data.messaging.mail);

                        if (opts.provider !== undefined && opts.provider !== null) {
                            if (server.app.config.messaging.mail.implementations[opts.provider]) {
                                server.app.config.messaging.mail.implementations[opts.provider].getSender(opts, callback);
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

            }
        },

        sms: {
            getTemplate: function (templateCode, callback) {
                var template = server.app.config.messaging.sms.templates[templateCode];
                if (template) {
                    callback(null, template.body);
                }
                else {
                    callback(new Error('sms template not found: ' + templateCode), null);
                }
            },
            getModel: function (templateCode, callback) {
                var template = server.app.config.messaging.sms.templates[templateCode];
                if (template) {
                    callback(null, template.model || {});
                }
                else {
                    callback(new Error('sms template not found: ' + templateCode), null);
                }
            },
            parseTemplate: function (template, model, callback) {
                try {
                    var result = mustache.render(template, model);
                    callback(null, result);
                }
                catch (err) {
                    callback(err, null);
                }
            },
            getSender: function (dpd, callback) {
           
                var settings = {
                    provider: 'null',
                    sender: ''
                };

                dpd.settings.getCached({
                    domain: 'core'
                }, function (res, err) {
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
                            if (server.app.config.messaging.sms.implementations[opts.provider]) {
                                server.app.config.messaging.sms.implementations[opts.provider].getSender(opts, callback);
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

            }
        }

    };

};

module.exports = Messager;