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
    var errorInternal = _.isNumber(error) ? error : 500;
    var stackInternal = stack || error;
    var errorMessage = errors[errorInternal];

    if (ctx.type === 'json') {
        var obj = {};
        if (typeof (stackInternal) === 'object' && typeof(stackInternal.message) === 'string') {
            obj[errorInternal] = stackInternal.message;
        }
        else if (typeof (stackInternal) === 'object') {
            obj = stackInternal;
        }
        else
            obj[errorInternal] = stackInternal || errorMessage;

        ctx.status(errorInternal).send(obj);
        return;
    }

    ctx.template = 'error';
    var tmplPath = '../www/public/err/';

    if (ctx.uri.first === 'admin') {
        ctx.template = 'admin-error';
        tmplPath = '../www/public/admin/err/';
    }

    var tmplFilePath = tmplPath + errorInternal + '.html';
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

    ctx.res.writeHead(errorInternal, { "Content-Type": "text/html" });
    
    if (!ctx.meta.title || ctx.meta.title === '')
        ctx.meta.title = this.server.app.title;
    else
        ctx.meta.title = this.server.app.title + (this.server.app.title ? ' | ' : '') + ctx.meta.title;

    ctx.halt = true;

    var parser = new HtmlParser(this.server);
    parser.parse(ctx, errorContent, {
        error: errorInternal,
        text: errorMessage,
        stack: stackInternal || ''
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