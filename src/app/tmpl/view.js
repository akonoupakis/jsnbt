var error = require('./error.js');
var fs = require('fs');
var _ = require('underscore');

_.str = require('underscore.string');

var ViewRenderer = function (server, ctx) {
    if (!ctx.template) {
        error(server, ctx, 500, 'template not defined');
    }
    else {
        var installedTemplate = _.find(server.app.config.templates, function (x) { return x.id === ctx.template; });
        if (!installedTemplate) {
            error(server, ctx, 500, 'template not found: ' + ctx.template);
        }
        else {
            var tmplFilePath = '../www/public' + installedTemplate.html;
            
            if (fs.existsSync(tmplFilePath)) {
                var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');

                ctx.res.writeHead(200, { "Content-Type": "text/html" });

                require('./html.js')(server).parse(ctx, tmplContent, {}, function (err, response) {
                    if (err) {
                        ctx.res.write('template parse failed: ' + err.toString());
                        ctx.res.end();
                    }
                    else {
                        ctx.res.write(response);
                        ctx.res.end();
                    }
                });
            }
            else {
                error(server, ctx, 500, 'template not found: ' + tmplFilePath);
            }
        }
    }

};

module.exports = ViewRenderer;