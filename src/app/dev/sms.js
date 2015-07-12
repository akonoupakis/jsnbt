module.exports = function(server) {

    return {

        route: function (ctx, next) {

            if (ctx.uri.parts.length > 2) {

                var templateCode = ctx.uri.parts[2];
                server.messager.sms.getTemplate(templateCode, function (err, tmpl) {
                    if (err) {
                        next();
                    }
                    else {
                        server.messager.sms.getModel(templateCode, function (modelErr, model) {
                            if (modelErr) {
                                ctx.error(modelErr);
                            }
                            else {
                                if (ctx.uri.query.model === 'true') {
                                    ctx.json(model);
                                }
                                else {
                                    server.messager.sms.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
                                        if (parseErr) {
                                            ctx.error(parseErr);
                                        }
                                        else {
                                            ctx.html(parsedTmpl);
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