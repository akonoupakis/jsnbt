var error = require('./error.js');
var fs = require('fs');
var _ = require('underscore');

_.str = require('underscore.string');

var ViewRenderer = function (server, ctx) {
    if (!ctx.template) {
        error(ctx, 500, 'template not defined');
    }
    else {
        var tmplFilePath = '../' + server.app.directory + '/public' + ctx.template;

        if (fs.existsSync(tmplFilePath)) {
            var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');

            ctx.writeHead(200, { "Content-Type": "text/html" });

            require('./parser.js')(server).parse(ctx, tmplContent, {}, function (response) {
                ctx.write(response);
                ctx.end();
            });
        }
        else {
            error(ctx, 500, 'template not found: ' + tmplFilePath);
        }
    }

};

module.exports = ViewRenderer;