var app = require('./app.js');
var auth = require('./auth.js');
var jsnbt = require('./jsnbt.js');
var errorRenderer = require('./rendering/error.js');
var viewRenderer = require('./rendering/view.js');
var crawler = require('./crawl/phantom.js');
var parseUri = require('parseUri');
var cookies = require('cookies');
var jsuri = require('jsuri');
var _ = require('underscore');

_.str = require('underscore.string');

var applyTemplate = function (ctxInternal) {
    var installedTemplate = _.first(_.filter(jsnbt.templates, function (x) { return x.id === ctxInternal.template; }));
    if (installedTemplate) {
        ctxInternal.template = installedTemplate.html;
        return true;
    }
    else {
        ctxInternal.error(500, 'text/html', 'template not installed: ' + ctxInternal.template);
        return false;
    }
};

var shouldRenderCrawled = function (ctx, req, res) {
    var prerender = false;

    if (req.headers["user-agent"]) {
        var userAgent = req.headers["user-agent"];
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
            if (auth.isInRole(ctx.user, 'admin'))
                prerender = true;

    return prerender;
};

var renderCrawled = function (ctx) {
    var targetUrl = new jsuri(_.str.rtrim(ctx.uri.getBaseHref(), '/') + ctx.uri.url).deleteQueryParam('prerender').toString();

    crawler.crawl(targetUrl, function (crawlErr, crawlData) {
        if (crawlErr) {
            ctx.error(500, crawlErr);
        }
        else {
            ctx.writeHead(200, { "Content-Type": "text/html" });
            ctx.write(crawlData);
            ctx.end();
        }
    });
};

module.exports = function (req, res) {
    var uri = new parseUri('http://' + app.hosts.host + ':' + app.hosts.port + req.url);

    if (!_.str.endsWith(uri.path, '/'))
        uri.path += '/';

    uri = new parseUri(('http://' + app.hosts.host + ':' + app.hosts.port + uri.path).toLowerCase() + (uri.query !== '' ? '?' + uri.query : ''));

    if (uri.path === '/' || uri.path.toLowerCase() === '/index.html')
        uri.path = '/';
    else {
        uri.path = _.str.rtrim(uri.path, '/').toLowerCase();
    }

    uri.parts = _.str.trim(uri.path, '/').split('/');
    uri.first = uri.parts.length > 0 ? _.first(uri.parts).toLowerCase() : '';
    uri.last = uri.parts.length > 0 ? _.last(uri.parts).toLowerCase() : '';

    req.cookies = new cookies(req, res);

    var ctx = {
        req: req,
        res: res,

        method: req.method,
        session: undefined,
        cookies: req.cookies,

        user: undefined,

        node: undefined,
        pointer: undefined,
        layout: '',

        meta: {
            title: '',
            description: '',
            keywords: ''
        },

        params: [],

        robots: {
            noindex: false,
            nofollow: false,
            noarchive: false,
            nosnipet: false,
            notranslate: false,
            noimageindex: false
        },

        template: '',

        uri: {
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
                    href += (this.port != 433) ? ':' + this.port : '';
                }
                else {
                    href += (this.port != 80) ? ':' + this.port : '';
                }
                href += '/';
                return href;
            }
        },

        restricted: false,

        error: function (code, stack, html) {
            req._routed = true;

            if (html === undefined)
                html = true;

            if (html) {
                errorRenderer.render(this, code, stack);
            }
            else {
                res.writeHead(code, { "Content-Type": 'application/text' });
                res.write(stack.toString());
                res.end();
            }
        },
        view: function () {
            req._routed = true;

            if (shouldRenderCrawled(this, req, res))
                renderCrawled(ctx);
            else {
                if (_.str.startsWith(this.template, '/'))
                    viewRenderer.render(this);
                else
                    if (applyTemplate(this))
                        viewRenderer.render(this);
            }
        },
        json: function (data) {
            req._routed = true;
            res.writeHead(200, { "Content-Type": "application/json" });
            res.write(JSON.stringify({ d: data }, null, app.dbg ? '\t' : ''));
            res.end();
        },
        redirect: function (url, mode) {
            req._routed = true;
            res.writeHead(mode || 302, { "Location": url });
            res.end();
        },
        writeHead: function (code, fields) {
            res.writeHead(code, fields);
        },
        write: function (obj) {
            res.write(obj);
        },
        end: function () {
            req._routed = true;
            res.end();
        }

    };

    return ctx;
};