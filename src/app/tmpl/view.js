var ErrorRenderer = require('./error.js');
var HtmlRenderer = require('./html.js');
var fs = require('fs');
var _ = require('underscore');

_.str = require('underscore.string');

var ViewRenderer = function (server) {

    this.server = server;

};

ViewRenderer.prototype.render = function (ctx) {
    var self = this;

    var errorRenderer = new ErrorRenderer(this.server);
    if (!ctx.template) {
        errorRenderer.render(ctx, 500, 'template not defined');
    }
    else {
        var installedTemplate = _.find(self.server.app.config.templates, function (x) { return x.id === ctx.template; });
        if (!installedTemplate) {
            errorRenderer.render(ctx, 500, 'template not found: ' + ctx.template);
        }
        else {
            var tmplFilePath = '../www/public' + installedTemplate.html;

            if (fs.existsSync(tmplFilePath)) {
                var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');

                ctx.res.writeHead(200, { "Content-Type": "text/html" });

                var htmlRenderer = new HtmlRenderer(self.server);
                htmlRenderer.parse(ctx, tmplContent, {}, function (err, response) {
                    if (err) {
                        errorRenderer.render(ctx, 500, err);
                    }
                    else {
                        ctx.res.write(response);
                        ctx.res.end();
                    }
                });
            }
            else {
                errorRenderer.render(ctx, 500, 'template not found: ' + tmplFilePath);
            }
        }
    }
};

module.exports = function (server) {
    return new ViewRenderer(server);
};