var app = require('./app.js');
var jsnbt = require('./jsnbt.js');
var fs = require('./utils/fs.js');
var html = require('./html.js');
var _ = require('underscore');

_.str = require('underscore.string');

exports.render = function (ctx) {
    if (!ctx.template) {
        ctx.res.write('could not find render template');
    }
    else {
        var tmplFilePath = '../' + app.root + '/public' + ctx.template;
        if (fs.existsSync(tmplFilePath)) {
            var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');

            ctx.res.writeHead(200, { "Content-Type": "text/html" });

            tmplContent = html.parse(ctx, tmplContent);

            ctx.res.write(tmplContent);
        }
        else {
            ctx.res.write('could not find template file "' + tmplFilePath + '"');
        }
    }
    ctx.res.end();
};