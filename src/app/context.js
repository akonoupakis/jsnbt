var app = require('./app.js');
var error = require('./error.js');
var view = require('./view.js');
var parseUri = require('parseUri');
var _ = require('underscore');

_.str = require('underscore.string');

module.exports = function (req, res) {
    var uri = new parseUri('http://' + app.config.host + ':' + app.config.port + req.url);
    
    if (!_.str.endsWith(uri.path, '/'))
        uri.path += '/';

    uri = new parseUri(('http://' + app.config.host + ':' + app.config.port + uri.path).toLowerCase() + (uri.query !== '' ? '?' + uri.query : ''));

    if (uri.path === '/' || uri.path.toLowerCase() === '/index.html')
        uri.path = '/';
    else {
        uri.path = _.str.rtrim(uri.path, '/').toLowerCase();
    }

    uri.parts = _.str.trim(uri.path, '/').split('/');
    uri.first = uri.parts.length > 0 ? _.first(uri.parts).toLowerCase() : '';
    uri.last = uri.parts.length > 0 ? _.last(uri.parts).toLowerCase() : '';

    var ctx = {
        req: req,
        res: res,
        node: {
            id: ''
        },
        meta: {
            title: '',
            description: '',
            keywords: ''
        },
        robots: {
            noindex: false,
            nofollow: false,
            noarchive: false,
            nosnipet: false,
            noodp: false,
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
        error: function (err, stack) {
            this.req._routed = true;
            error.render(this, err, stack);
        },
        render: function () {
            this.req._routed = true;
            view.render(this);
        },
        redirect: function (url, mode) {
            this.req._routed = true;
            this.res.writeHead(mode || 302, { "Location": url });
            this.res.end();
        }
    };

    return ctx;
};