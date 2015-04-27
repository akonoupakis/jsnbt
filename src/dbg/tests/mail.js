module.exports = function(server) {

    return {

        test: function (ctx, next) {
            
            server.messager.mail.getTemplate('registrationConfirmation', function (err, tmpl) {
                if (err) {
                    ctx.error(err);
                }
                else {
                    var model = {
                        firstName: 'first name here',
                        lastName: 'last name here'
                    };
                    server.messager.mail.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                        if (parseErr) {
                            ctx.error(parseErr);
                        }
                        else {

                            server.messager.mail.createSender(ctx.dpd, function (senderErr, sender) {
                                if (senderErr) {
                                    ctx.error(senderErr);
                                }
                                else {
                                    sender.send({
                                        to: '',
                                        subject: '',
                                        body: ''
                                    }, function (sendErr, response) {
                                        if (sendErr) {
                                            ctx.error(sendErr);
                                        }
                                        else {
                                            ctx.json({ sent: true });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });

        }

    }

}