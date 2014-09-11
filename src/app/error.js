var app = require('./app.js');
var fs = require('./utils/fs.js');
var html = require('./html.js');
var _ = require('underscore');

_.str = require('underscore.string');

var errors = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    410: 'Gone',
    500: 'Server Error',
    503: 'Service Unavailable',
};

//var getCachedTemplate = function (baseHref, view) {
//    if (cached) {
//        var cached = app.cache.get('tmpl:' + baseHref + view);
//        return cached;
//    }
//    else {
//        var errorContent = '';

//        if (fs.existsSync(view)) {
//            errorContent = fs.readFileSync(view, 'utf-8');
//            errorContent = errorContent.replace(/<base href="" \/>/g, '<base href="' + baseHref + '" />');
//        }

//        app.cache.set('tmpl:' + view, errorContent);
//        return errorContent;
//    }
//}

exports.render = function (ctx, error, stack) {
    var tmplPath = '../' + app.root + '/public/tmpl/error/';
    if (ctx.uri.first === 'admin')
        tmplPath = '../' + app.root + '/public/admin/tmpl/error/';

    var tmplFilePath = tmplPath + error + '.html';
    var tmplDefaultFilePath = tmplPath + 'error.html';
    var baseHref = ctx.uri.getBaseHref();

    var errorContent = '';
    if (fs.existsSync(tmplFilePath)) {
        errorContent = fs.readFileSync(tmplFilePath, 'utf-8');
    }

    if (errorContent === '') {
        errorContent = fs.readFileSync(tmplDefaultFilePath, 'utf-8');
    }

    ctx.res.writeHead(error, { "Content-Type": "text/html" });

    var text = null;
    if (errors[error])
        text = errors[error];

    errorContent = html.parse(ctx, errorContent, {
        error: error,
        text: text,
        stack: stack
    });

    ctx.res.write(errorContent);
    ctx.res.end();
};