var fs = require('fs');
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

var ErrorRenderer = function (server, ctx, error, stack, html) {
    
    if (html === false) {
        var obj = {};
        obj[error] = errors[error];
        ctx.status(error).send(obj);
        return;
    }

    ctx.template = 'error';
    var tmplPath = '../www/public/err/';

    if (ctx.uri.first === 'admin') {
        ctx.template = 'admin-error';
        tmplPath = '../www/public/admin/err/';
    }

    var tmplFilePath = tmplPath + error + '.html';
    var tmplDefaultFilePath = tmplPath + 'error.html';

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
        ctx.meta.title = server.app.title;
    else
        ctx.meta.title = server.app.title + (server.app.title ? ' | ' : '') + ctx.meta.title;

    ctx.halt = true;

    require('./html.js')(server).parse(ctx, errorContent, {
        error: error,
        text: text,
        stack: stack || ''
    }, function (err, response) {
        if (err) {
            ctx.res.write('template parse failed: ' + err.toString());
            ctx.res.end();
        }
        else {
            ctx.res.write(response);
            ctx.res.end();
        }
    });

};

module.exports = ErrorRenderer;