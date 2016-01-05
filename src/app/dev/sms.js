var SmsHandler = function (server) {
    this.server = server;
};

SmsHandler.prototype.route = function (ctx, next) {
    var self = this;

    if (ctx.uri.parts.length > 2) {

        var templateCode = ctx.uri.parts[2];
        self.server.messager.sms.getTemplate(templateCode, function (err, tmpl) {
            if (err) {
                next();
            }
            else {
                self.server.messager.sms.getModel(templateCode, function (modelErr, model) {
                    if (modelErr) {
                        ctx.error(modelErr);
                    }
                    else {
                        if (ctx.uri.query.model === 'true') {
                            ctx.json(model);
                        }
                        else {
                            self.server.messager.sms.parseTemplate(tmpl, model, function (parseErr, parsedTmpl) {
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

};

module.exports = function (server) {
    return new SmsHandler(server);
};