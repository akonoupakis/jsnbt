var app = require('../app.js');
var jsnbt = require('../jsnbt.js');
var error = require('./error.js');
var fs = require('fs');
var tmplParser = require('../parsing/tmpl.js');
var _ = require('underscore');

_.str = require('underscore.string');

exports.render = function (ctx) {
    if (!ctx.template) {
        error.render(ctx, 500, 'template not defined');
    }
    else {
        var tmplFilePath = '../' + app.directory + '/public' + ctx.template;
        
        if (fs.existsSync(tmplFilePath)) {
            var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');

            ctx.writeHead(200, { "Content-Type": "text/html" });

            tmplContent = tmplParser.parse(ctx, tmplContent);

            ctx.write(tmplContent);
            ctx.end();
        }
        else {
            error.render(ctx, 500, 'template not found: ' + tmplFilePath);
        }
    }
};