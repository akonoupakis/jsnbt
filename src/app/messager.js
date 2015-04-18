var Messager = function (server) {

    return {

        createMailSender: function (dpd, success, error) {

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
                    if (typeof (error) === 'function')
                        error(err);
                    else
                        throw err;
                }
                else {
                    var first = _.first(res);

                    var opts = {};
                    _.extend(opts, settings);
                    if (first.data && first.data.messager && first.data.messager.mail)
                        _.extend(opts, first.data.messager.mail);

                    if (opts.provider !== undefined && opts.provider !== null && opts.provider !== 'null') {
                        if (opts.provider === 'core') {
                            var mailSender = require('./messaging/mailSender.js')(opts, dpd);
                            if (typeof (success) === 'function')
                                success(mailSender);
                        }
                        else {
                            var firstMatchedModule = _.find(server.app.modules.all, function (x) { return x.domain === opts.provider; });
                            if (firstMatchedModule && typeof (firstMatchedModule.createMailSender) === 'function') {

                                firstMatchedModule.createMailSender(opts, dpd, function (mailSender) {
                                    if (typeof (success) === 'function')
                                        success(mailSender);
                                });

                            }
                            else {
                                var err = new Error('mail messager module not found: ' + opts.provider);

                                if (typeof (error) === 'function')
                                    error(err);
                                else
                                    throw err;
                            }
                        }
                    }
                    else {
                        var err = new Error('mail messager module not defined');

                        if (typeof (error) === 'function')
                            error(err);
                        else
                            throw err;
                    }
                }
            });

        },

        createSmsSender: function (dpd, success, error) {

            var settings = {
                provider: 'null',
                sender: 'jsnbt'
            };

            dpd.settings.getCached({
                domain: 'core'
            }, function (res, err) {
                if (err) {
                    if (typeof (error) === 'function')
                        error(err);
                    else
                        throw err;
                }
                else {
                    var first = _.first(res);

                    var opts = {};
                    _.extend(opts, settings);
                    if (first.data && first.data.messager && first.data.messager.sms)
                        _.extend(opts, first.data.messager.sms);

                    if (opts.provider !== undefined && opts.provider !== null && opts.provider !== 'null') {
                        if (opts.provider === 'core') {
                            var mailSender = require('./messaging/smsSender.js')(opts, dpd);
                            if (typeof (success) === 'function')
                                success(mailSender);
                        }
                        else {
                            var firstMatchedModule = _.find(server.app.modules.all, function (x) { return x.domain === opts.provider; });
                            if (firstMatchedModule && typeof (firstMatchedModule.createSmsSender) === 'function') {

                                firstMatchedModule.createSmsSender(opts, dpd, function (mailSender) {
                                    if (typeof (success) === 'function')
                                        success(mailSender);
                                });

                            }
                            else {
                                var err = new Error('sms messager module not found: ' + opts.provider);
                                if (typeof (error) === 'function')
                                    error(err);
                                else
                                    throw err;
                            }
                        }
                    }
                    else {
                        var err = new Error('sms messager module not defined');
                        if (typeof (error) === 'function')
                            error(err);
                        else
                            throw err;
                    }
                }
            });
        }

    };

};

module.exports = Messager;