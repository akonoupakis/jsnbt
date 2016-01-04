var fs = require('fs');
var HtmlParser = require('./html.js');
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

var ErrorRenderer = function (server) {
    
    this.server = server;

};

ErrorRenderer.prototype.render = function (ctx, error, stack) {
    if (ctx.type === 'json') {
        var obj = {};
        obj[error] = stack || errors[error];
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
        ctx.meta.title = this.server.app.title;
    else
        ctx.meta.title = this.server.app.title + (this.server.app.title ? ' | ' : '') + ctx.meta.title;

    ctx.halt = true;

    var parser = new HtmlParser(this.server);
    parser.parse(ctx, errorContent, {
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

module.exports = function (server) {
    return new ErrorRenderer(server);
};