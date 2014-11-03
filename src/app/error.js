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

exports.render = function (ctx, error, stack) {
    var tmplPath = '../' + app.root + '/public/error/';
    if (ctx.uri.first === 'admin')
        tmplPath = '../' + app.root + '/public/admin/error/';

    var tmplFilePath = tmplPath + error + '.html';
    var tmplDefaultFilePath = tmplPath + 'error.html';
    var baseHref = ctx.uri.getBaseHref();

    var errorContent = '';
    if (fs.existsSync(tmplFilePath)) {
        errorContent = fs.readFileSync(tmplFilePath, 'utf-8');
    }

    if (errorContent === '') {
        if (fs.existsSync(tmplDefaultFilePath)) {
            errorContent = fs.readFileSync(tmplDefaultFilePath, 'utf-8');
        }
        else {
            errorContent = '<%= error %>';
        }
    }

    ctx.res.writeHead(error, { "Content-Type": "text/html" });

    var text = null;
    if (errors[error])
        text = errors[error];

    if (!ctx.meta.title || ctx.meta.title === '')
        ctx.meta.title = app.title;
    else
        ctx.meta.title = app.title + (app.title ? ' | ' : '') + ctx.meta.title;

    errorContent = html.parse(ctx, errorContent, {
        error: error,
        text: text,
        stack: stack || ''
    });

    ctx.res.write(errorContent);
    ctx.res.end();
};