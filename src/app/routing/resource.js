var Context = require('../contextServer');
var escapeRegExp = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
var debug = require('debug')('router');
var doh = require('doh');
var error404 = doh.createResponder();
var async = require('async');
var Cookies = require('cookies');
var qs = require('qs');
var parseUrl = require('url').parse;
var corser = require('corser');
var ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

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

        var handler = doh.createHandler({ req: req, res: res, server: server });
        handler.run(function () {
            process.nextTick(function () {
                if (resource) {
                    debug('routing %s to %s', req.url, resource.path);
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
                    debug('404 %s', req.url);
                    res.statusCode = 404;
                    error404({ message: 'resource not found' }, req, res);
                }
            });
        });
    }

};

Router.prototype.matchResources = function (url) {
    var router = this
      , result;

    debug('resources %j', this.resources.map(function (r) { return r.path; }));

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
            if (ctx.uri.first === 'dpd' && ctx.uri.parts.length > 1) {
                setupRequest(ctx.req, ctx.res, function (err, next) {
                    if (err) return ctx.res.end(err.message);
                    var router = new Router(server.resources, server);
                    router.route(ctx.req, ctx.res, next);
                });
            }
            else {
                next();
            }
        }

    };

};

module.exports = ResourceRouter;