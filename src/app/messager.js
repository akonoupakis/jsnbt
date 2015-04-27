var extend = require('extend');
var _ = require('underscore');

var Messager = function (server) {

    return {

        mail: {
            getTemplate: function (templateCode, callback) {
                callback(new Error('not implemented'), null);
            },
            parseTemplate: function (template, model, callback) {
                callback(new Error('not implemented'), null);
            },
            parseDebugTemplate: function (template, callback) {
                callback(new Error('not implemented'), null);
            },
            getSender: function (dpd, callback) {

                var settings = {
                    provider: 'core',
                    host: '127.0.0.1',
                    username: '',
                    password: '',
                    port: 21,
                    sender: 'info@domain.com',
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

                        if (opts.provider !== undefined && opts.provider !== null && opts.provider !== 'null') {
                            if (opts.provider === 'core') {
                                var mailSender = require('./messaging/mailSender.js')(opts);
                                callback(null, mailSender);
                            }
                            else {
                                var firstMatchedModule = _.find(server.app.modules.rest, function (x) { return x.domain === opts.provider && _.isObject(x.messaging) && _.isObject(x.messaging.mail) && _.isFunction(x.messaging.mail.getSender); });
                                if (firstMatchedModule) {
                                    firstMatchedModule.messaging.mail.getSender(opts, callback);
                                }
                                else {
                                    callback(new Error('mail messager module not found: ' + opts.provider), null);
                                }
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
                callback(new Error('not implemented'), null);
            },
            parseTemplate: function (template, model, callback) {
                callback(new Error('not implemented'), null);
            },
            parseDebugTemplate: function (template, model, callback) {
                callback(new Error('not implemented'), null);
            },
            getSender: function (dpd, callback) {
           
                var settings = {
                    provider: 'null',
                    sender: 'jsnbt'
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

                        if (opts.provider !== undefined && opts.provider !== null && opts.provider !== 'null') {
                            if (opts.provider === 'core') {
                                var mailSender = require('./messaging/smsSender.js')(opts);
                                callback(null, mailSender);
                            }
                            else {
                                var firstMatchedModule = _.find(server.app.modules.rest, function (x) { return x.domain === opts.provider && _.isObject(x.messaging) && _.isObject(x.messaging.mail) && _.isFunction(x.messaging.sms.getSender); });
                                if (firstMatchedModule) {
                                    firstMatchedModule.messaging.sms.getSender(opts, callback);
                                }
                                else {
                                    callback(new Error('sms messager module not found: ' + opts.provider), null);
                                }
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