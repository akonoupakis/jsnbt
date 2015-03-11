var app = require('./app.js');
var jsnbt = require('./jsnbt.js');
var error = require('./error.js');
var fs = require('./utils/fs.js');
var html = require('./html.js');
var _ = require('underscore');

_.str = require('underscore.string');

exports.render = function (ctx) {
    if (!ctx.template) {
        error.render(ctx, 500, 'template not defined');
    }
    else {
        var tmplFilePath = '../' + app.root + '/public' + ctx.template;
        if (fs.existsSync(tmplFilePath)) {
            var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');

            ctx.res.writeHead(200, { "Content-Type": "text/html" });

            tmplContent = html.parse(ctx, tmplContent);

            ctx.res.write(tmplContent);
            ctx.res.end();
        }
        else {
            error.render(ctx, 500, 'template not found: ' + tmplFilePath);
        }
    }
};