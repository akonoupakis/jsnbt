var error = require('./tmpl/error.js');
var view = require('./tmpl/view.js');
var parseUri = require('parseUri');
var jsuri = require('jsuri');
var _ = require('underscore');

_.str = require('underscore.string');

var checkTemplate = function (server, ctx) {
    var installedTemplate = _.find(server.app.config.templates, function (x) { return x.id === ctx.template; });
    if (installedTemplate) {
        return true;
    }
    else {
        ctx.error(500, 'text/html', 'template not installed: ' + ctx.template);
        return false;
    }
};

var shouldRenderCrawled = function (server, ctx) {

    var authMngr = require('./cms/authMngr.js')(server);
    var prerender = false;

    if (ctx.req.headers["user-agent"]) {
        var userAgent = ctx.req.headers["user-agent"];
        var searchbots = ['google', 'googlebot', 'yahoo', 'baiduspider', 'bingbot', 'yandexbot', 'teoma'];
        _.each(searchbots, function (searchbot) {
            if (userAgent.toLowerCase().indexOf(searchbot) !== -1) {
                prerender = true;
                return false;
            }
        });
    }

    if (!prerender)
        if (ctx.uri.query.prerender)
            if (authMngr.isInRole(ctx.user, 'admin'))
                prerender = true;

    return prerender;
};

var renderCrawled = function (server, ctx) {
    var targetUrl = new jsuri(_.str.rtrim(ctx.uri.getBaseHref(), '/') + ctx.uri.url).deleteQueryParam('prerender').toString();

    var crawler = require('./crawler.js')(server);
    crawler.crawl(targetUrl, function (crawlData) {
        ctx.writeHead(200, { "Content-Type": "text/html" });
        ctx.write(crawlData);
        ctx.end();
    }, function (crawlErr) {
        ctx.error(500, crawlErr);
    });
};

var Context = function (server, req, res) {

    this.server = server;
    this.req = req;
    this.res = res;

    var uri = new parseUri('http://' + server.host + req.url);

    if (!_.str.endsWith(uri.path, '/'))
        uri.path += '/';

    uri = new parseUri(('http://' + server.host + uri.path).toLowerCase() + (uri.query !== '' ? '?' + uri.query : ''));

    var timer = require('./log/timeLogger.js')('context: ' + uri.relative);
    timer.start();

    this.dbgLogger = require('./log/debugLogger.js')();

    if (uri.path === '/' || uri.path.toLowerCase() === '/index.html')
        uri.path = '/';
    else {
        uri.path = _.str.rtrim(uri.path, '/').toLowerCase();
    }

    uri.parts = _.str.trim(uri.path, '/').split('/');
    uri.first = uri.parts.length > 0 ? _.first(uri.parts).toLowerCase() : '';
    uri.last = uri.parts.length > 0 ? _.last(uri.parts).toLowerCase() : '';

    this.method = req.method;
    
    this.timer = timer;

    this.node = undefined;
    this.hierarchy = [];
    this.pointer = undefined;
    this.layouts = [];

    this.meta = {
        title: '',
        description: '',
        keywords: []
    };

    this.params = [];

    this.robots = {
        noindex: false,
        nofollow: false,
        noarchive: false,
        nosnipet: false,
        notranslate: false,
        noimageindex: false
    };

    this.template = '';

    this.uri = {
        url: uri.relative,
        scheme: uri.protocol,
        host: uri.host,
        port: uri.port,
        path: uri.path,
        parts: uri.parts,
        query: uri.queryKey,
        first: uri.first,
        last: uri.last,
        getBaseHref: function () {
            var href = this.scheme;
            href += '://';
            href += this.host;

            if (this.scheme === 'https') {
                href += (this.port !== '433' && this.port !== '433') ? ':' + this.port : '';
            }
            else {
                href += (this.port !== '80' && this.port !== '') ? ':' + this.port : '';
            }
            href += '/';
            return href;
        }
    };

    this.restricted = false;
};

Context.prototype.status = function (code) {
    this.res.status.apply(this.res, arguments);
    return this;
};

Context.prototype.send = function (result) {
    this.timer.stop();
    this.res.send.apply(this.res, arguments);
    return this;
};


Context.prototype.debug = function (text) {
    if ((this.uri.query.dbg || '').toLowerCase() === 'true') {
        this.dbgLogger.log(text);
    }
};

Context.prototype.error = function (code, stack) {
    error(this.server, this, code, stack);
};

Context.prototype.view = function () {
    if ((this.uri.query.dbg || '').toLowerCase() === 'true' && (this.uri.query.type || '').toLowerCase() === 'json') {
        this.send({
            uri: this.uri,
            logs: this.dbgLogger.get(),
            timer: this.timer.get()
        });
    }
    else {
        if (shouldRenderCrawled(this.server, this))
            renderCrawled(this.server, this);
        else {
            if (_.str.startsWith(this.template, '/'))
                view(this.server, this);
            else {
                if (checkTemplate(this.server, this)) {
                    view(this.server, this);
                }
                else {
                    error(this.server, this, 500, 'template not found: ' + this.template);
                }
            }
        }
    }
};

Context.prototype.json = function (data) {
    this.send(data);
};

Context.prototype.html = function (html) {
    this.res.writeHead(200, { "Content-Type": 'text/html' });
    this.res.write(html);
    this.res.end();
};

Context.prototype.redirect = function (url, mode) {
    this.timer.stop();

    this.res.writeHead(mode || 302, { "Location": url });
    this.res.end();
};

module.exports = function (server, req, res) {
    return new Context(server, req, res);
};