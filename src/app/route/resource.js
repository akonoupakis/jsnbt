var escapeRegExp = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
var async = require('async');
var Cookies = require('cookies');
var qs = require('qs');
var parseUrl = require('url').parse;
var corser = require('corser');
var ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

function Context(resource, req, res, server) {
    var ctx = this;
    this.url = req.url.slice(resource.path.length).split('?')[0];

    if (this.url.indexOf('/') !== 0) this.url = '/' + this.url;

    this.req = req;
    this.res = res;
    this.body = req.body;
    this.query = req.query || {};
    this.server = server;
    this.session = req.session;
    this.method = req && req.method;

    var done = this.done;
    this.done = function () {
        done.apply(ctx, arguments);
    };

    if ((this.query && typeof this.query.$limitRecursion !== 'undefined') || (this.body && typeof this.body.$limitRecursion !== 'undefined')) {
        var recursionLimit = this.query.$limitRecursion || this.body.$limitRecursion || 0;
        req.stack = req.stack || [];
        req.stack.recursionLimit = recursionLimit;
    }

    this.db = req.db || require('../database.js').build(server, req.session, req.stack);
}

Context.prototype.end = function () {
    return this.res.end.apply(this.res, arguments);
};

Context.prototype.done = function (err, res) {
    var body = res
      , type = 'application/json';

    var status = this.res.statusCode = this.res.statusCode || 200;

    if (err) {
        if (status < 400) this.res.statusCode = 400;
        if (err.statusCode) this.res.statusCode = err.statusCode;
        this.res.write(new Buffer(JSON.stringify(err, null, this.server.app.dbg ? '\t' : '')));
        this.req._routed = true;
        this.res.end();
    } else {
        if (typeof body == 'object') {
            body = JSON.stringify(body);
        } else {
            type = 'text/html; charset=utf-8';
        }

        try {
            if (status != 204 && status != 304) {
                if (body) {
                    this.res.setHeader('Content-Length', Buffer.isBuffer(body)
                         ? body.length
                         : Buffer.byteLength(body));
                }
                this.res.setHeader('Content-Type', type);
                this.res.end(body);
            } else {
                this.res.end();
            }
        } catch (e) {
            console.error(e);
        }
    }
};

function Router(resources, server) {
    this.resources = resources || [];
    this.server = server;
}

Router.prototype.route = function (req, res, next) {
    var router = this
      , server = this.server
      , url = req.url
      , resources = this.matchResources(url)
      , i = 0;

    async.series([function (fn) {
        async.forEach(router.resources, function (resource, fn) {
            if (resource.handleSession) {
                
                var ctx = new Context(resource, req, res, server);
                resource.handleSession(ctx, fn);

            } else {
                fn();
            }
        }, fn);
    }], function (err) {
        if (err) throw err;
        nextResource();
    });

    function nextResource() {
        var resource = resources[i++]
          , ctx;

        if (resource) {
            ctx = new Context(resource, req, res, server);
            ctx.router = router;

            if (ctx.session) ctx.session.isRoot = req.isRoot || false;

            var furl = ctx.url.replace('/', '');
            if (resource.external && resource.external[furl]) {
                resource.external[furl](ctx.body, ctx, ctx.done);
            } else {
                resource.handle(ctx, nextResource);
            }
        } else {
            if (next) {
                next();
            }
            else {
                res.statusCode = 404;
                res.write(new Buffer(JSON.stringify({
                    "message": "not found",
                    "statusCode": 404
                }, null, server.app.dbg ? '\t' : '')));
                req._routed = true;
                res.end();
            }
        }
    }

};

Router.prototype.matchResources = function (url) {
    var router = this
      , result;

    if (!this.resources || !this.resources.length) return [];

    result = this.resources.filter(function (d) {
        return url.match(router.generateRegex(d.path));
    }).sort(function (a, b) {
        return specificness(b) - specificness(a);
    });
    return result;
};

Router.prototype.generateRegex = function (path) {
    if (!path || path === '/') path = '';
    path = path.replace(escapeRegExp, '\\$&');
    return new RegExp('^' + path + '(?:[/?].*)?$');
};

function specificness(resource) {
    var path = resource.path;
    if (!path || path === '/') path = '';
    return path.split('/').length;
}

var setupRequest = function (req, res, next) {
    var remoteHost = req.headers.origin
      , corsOpts = { supportsCredentials: true, methods: ALLOWED_METHODS };

    if (remoteHost) {
        corsOpts.origins = [remoteHost];
    } else {
        corsOpts.supportsCredentials = false;
    }

    corsOpts.requestHeaders = corser.simpleRequestHeaders.concat(["X-Requested-With"]);
    var handler = corser.create(corsOpts);

    handler(req, res, function () {
        req.cookies = res.cookies = new Cookies(req, res);

        if (~req.url.indexOf('?')) {
            try {
                req.query = parseQuery(req.url);
                var m = req.query._method;
                if (m) {
                    req['originalMethod'] = req.method;
                    req.method = m.toUpperCase();
                    delete req.query['_method'];
                }
            } catch (ex) {
                res.setHeader('Content-Type', 'text/plain');
                res.statusCode = 400;
                res.end('Failed to parse querystring: ' + ex);
                return;
            }
        }

        switch (req.method) {
            case 'OPTIONS':
                // End CORS preflight request.
                res.writeHead(204);
                res.end();
                break;
            case 'POST':
            case 'PUT':
            case 'DELETE':
                var mime = req.headers['content-type'] || 'application/json';
                mime = mime.split(';')[0]; //Just in case there's multiple mime types, pick the first

                if (autoParse[mime]) {
                    autoParse[mime](req, res, mime, next);
                } else {
                    if (req.headers['content-length']) req.pause();
                    next();
                }
                break;
            default:
                next();
                break;
        }
    });
};

var parseBody = function (req, res, mime, callback) {
    var buf = '';

    req.on('data', function (chunk) { buf += chunk; });
    req.on('end', function () {
        var parser = JSON;

        if (mime === 'application/x-www-form-urlencoded') {
            parser = qs;
        }

        try {
            if (buf.length) {
                if (mime === 'application/json' && '{' != buf[0] && '[' != buf[0]) {
                    res.setHeader('Content-Type', 'text/plain');
                    res.statusCode = 400;
                    res.end('Could not parse invalid JSON');
                    return;
                }

                req.body = parser.parse(buf);
                var m = req.body['_method'];
                if (m) {
                    req['originalMethod'] = req.method;
                    req.method = m.toUpperCase();
                    delete req.body['_method'];
                }
            } else {
                req.body = {};
            }
            callback();
        } catch (ex) {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 400;
            res.end('Failed to parse body as ' + mime);
        }
    });
};

var parseQuery = function (url) {
    var q = url.substr(url.indexOf('?') + 1);

    if (q) q = decodeURIComponent(q);

    if (q[0] === '{' && q[q.length - 1] === '}') {
        return JSON.parse(q);
    } else {
        return parseNumbersInObject(qs.parse(parseUrl(url).query));
    }
};

var autoParse = {
    'application/x-www-form-urlencoded': parseBody,
    'application/json': parseBody
};

var isInt = /^[0-9]+$/;
var isFloat = /^[-+]?[0-9]*\.?[0-9]+$/;
var parseNumbersInObject = function (obj) {
    var ret = {}, key;
    for (key in obj) {
        val = obj[key];
        if (isInt.test(val)) {
            ret[key] = parseInt(val);
        } else if (isFloat.test(val)) {
            ret[key] = parseFloat(val);
        } else if (typeof val === 'object') {
            ret[key] = parseNumbersInObject(val);
        } else {
            ret[key] = val;
        }
    }
    return ret;
}

var ResourceRouter = function (server) {
    
    return {

        route: function (ctx, next) {
            if (ctx.uri.first === 'jsnbt-db' && ctx.uri.parts.length > 1) {
                setupRequest(ctx.req, ctx.res, function (err) {
                    if (err) return ctx.res.end(err.message);
                    var router = new Router(server.resources, server);
                    router.route(ctx.req, ctx.res, next);
                });
            }
            else {
                next();
            }
        },

        process: function (ctx) {
            var router = new Router(server.resources, server);
            router.route(ctx.req, ctx.res);
        }
    };

};

module.exports = ResourceRouter;