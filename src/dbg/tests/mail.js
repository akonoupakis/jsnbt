module.exports = function(server) {

    return {

        test: function (ctx, next) {
            
            var templateCode = 'registration';
            server.messager.mail.getTemplate(templateCode, function (err, tmpl) {
                if (err) {
                    ctx.error(err);
                }
                else {
                    server.messager.mail.getModel(templateCode, function (modelErr, model) {
                        if (modelErr) {
                            ctx.error(modelErr);
                        }
                        else {
                            server.messager.mail.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                                if (parseErr) {
                                    ctx.error(parseErr);
                                }
                                else {
                                    server.messager.mail.getSender(ctx.db, function (senderErr, sender) {
                                        if (senderErr) {
                                            ctx.error(senderErr);
                                        }
                                        else {
                                            sender.send({
                                                to: 'konoupakis@gmail.com',
                                                subject: parsedTmpl.subject,
                                                body: parsedTmpl.body
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
            });

        }

    }

}