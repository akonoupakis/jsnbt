module.exports = function(server) {

    return {

        route: function (ctx, next) {

            if (ctx.uri.parts.length > 2) {

                var templateCode = ctx.uri.parts[2];
                server.messager.mail.getTemplate(templateCode, function (err, tmpl) {
                    if (err) {
                        next();
                    }
                    else {
                        server.messager.mail.getModel(templateCode, function (modelErr, model) {
                            if (modelErr) {
                                ctx.error(modelErr);
                            }
                            else {
                                if (ctx.uri.query.model === 'true') {
                                    ctx.json(model);
                                }
                                else {
                                    server.messager.mail.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                                        if (parseErr) {
                                            ctx.error(parseErr);
                                        }
                                        else {
                                            if (ctx.uri.query.mode === 'subject') {
                                                ctx.html(parsedTmpl.subject);
                                            }
                                            else {
                                                ctx.html(parsedTmpl.body);
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });

            }
            else {
                next();
            }

        }

    }

}