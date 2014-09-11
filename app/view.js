var app = require('./app.js');
var fs = require('./utils/fs.js');
var html = require('./html.js');
var _ = require('underscore');

_.str = require('underscore.string');

//var getCachedTemplate = function (baseHref, view) {
//    if (cached) {
//        var cached = app.cache.get('tmpl:' + baseHref + view);
//        return cached;
//    }
//    else {
//        var tmplContent = fs.readFileSync(view, 'utf-8');
//        tmplContent = tmplContent.replace(/<base href="" \/>/g, '<base href="' + baseHref + '" />');
//        app.cache.set('tmpl:' + view, tmplContent);
//        return tmplContent;
//    }
//}

exports.render = function (ctx, view) {
    var tmplFilePath = '../' + app.root + '/public' + view;

    //var tmplContent = getCachedTemplate(baseHref, tmplFilePath);

    var tmplContent = fs.readFileSync(tmplFilePath, 'utf-8');
    ctx.res.writeHead(200, { "Content-Type": "text/html" });

    tmplContent = html.parse(ctx, tmplContent, {});

    ctx.res.write(tmplContent);
    ctx.res.end();
};