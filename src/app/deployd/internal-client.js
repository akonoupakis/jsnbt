var debug = require('debug')('internal-client');
var cache = require('./cache.js');
var _ = require('underscore');

function normalizeArray(parts, allowAboveRoot) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0;
    for (var i = parts.length - 1; i >= 0; i--) {
        var last = parts[i];
        if (last == '.') {
            parts.splice(i, 1);
        } else if (last === '..') {
            parts.splice(i, 1);
            up++;
        } else if (up) {
            parts.splice(i, 1);
            up--;
        }
    }

    // if the path is allowed to go above the root, restore leading ..s
    if (allowAboveRoot) {
        for (; up--; up) {
            parts.unshift('..');
        }
    }

    return parts;
}

var normalizePath = function (path) {
    var isAbsolute = path.charAt(0) === '/',
        trailingSlash = path.slice(-1) === '/';

    // Normalize the path
    path = normalizeArray(path.split('/').filter(function (p) {
        return !!p;
    }), !isAbsolute).join('/');

    if (!path && !isAbsolute) {
        path = '.';
    }
    if (path && trailingSlash) {
        path += '/';
    }

    return (isAbsolute ? '/' : '') + path;
};


function joinPath() {
    var paths = Array.prototype.slice.call(arguments, 0);
    return normalizePath(paths.filter(function (p, index) {
        return p && typeof p === 'string';
    }).join('/'));
}



exports.build = function (server, session, stack) {
    var baseMethods
      , dpd = {};

    baseMethods = {
        request: function (method, options, fn) {
            var req
              , res
              , urlKey
              , recursions
              , recursionLimit;

            if (method === 'COUNT') {
                method = 'GET';
                options.path += '/count';
            }

            req = {
                url: joinPath('/', options.path)
              , method: method
              , query: options.query
              , body: options.body
              , session: session
              , isRoot: session && session.isRoot
              , internal: true
              , headers: {}
              , on: function () { }
            };

            urlKey = req.method + ' ' + req.url;

            req.stack = stack || [];
            debug("Stack: %j", stack);

            recursions = req.stack.filter(function (s) { return s === urlKey; }).length;

            recursionLimit = (stack && stack.recursionLimit) || 20;

            if (recursions < recursionLimit) {
                req.stack.push(urlKey);
                debug("Putting %s on stack", urlKey);

                res = {
                    setHeader: function () { },
                    end: function (data) {
                        if (typeof fn === 'function') {
                            if (res.statusCode === 200 || res.statusCode === 204) {
                                try {
                                    fn(JSON.parse(data), null);
                                } catch (ex) {
                                    fn(data, null);
                                }
                            } else {
                                fn(null, data);
                            }
                        }
                    },
                    internal: true,
                    headers: {},
                    on: function () { }
                };

                server.router.route(req, res);
            } else {
                debug("Recursive call detected - aborting");
                if (typeof fn === 'function') fn(null, "Recursive call to " + urlKey + " detected");
            }
        }
    };

    baseMethods.get = function (options, fn) {
        return baseMethods.request("GET", options, fn);
    };

    baseMethods.post = function (options, fn) {
        return baseMethods.request("POST", options, fn);
    };

    baseMethods.put = function (options, fn) {
        return baseMethods.request("PUT", options, fn);
    };

    baseMethods.del = function (options, fn) {
        return baseMethods.request("DELETE", options, fn);
    };

    baseMethods.count = function (options, fn) {
        return baseMethods.request("COUNT", options, fn);
    };

    if (server.resources) {
        server.resources.forEach(function (r) {
            if (r.clientGeneration) {
                var rpath = r.path;

                var jsName = r.path.replace(/[^A-Za-z0-9]/g, '');

                if (rpath.indexOf('/dpd/') == 0) {
                    rpath = rpath.substring('dpd'.length + 1);
                    jsName = rpath.replace(/[^A-Za-z0-9]/g, '');
                }

                dpd[jsName] = createResourceClient(server, r, jsName, baseMethods);
            }
        });
    }

    return dpd;
};

function createResourceClient(server, resource, collection, baseMethods) {
    var r = {
        get: function (func, p, query, fn) {
            var settings = parseGetSignature(arguments);
            settings.path = joinPath(resource.path, settings.path);

            return baseMethods.get(settings, settings.fn);
        }
       , getCached: function (func, p, query, fn) {
           var settings = parseGetSignature(arguments);
           settings.path = joinPath(resource.path, settings.path);

           var settingsQuery = {};
           _.extend(settingsQuery, settings.query);

           var cacheKey = 'dpd.' + collection + '.' + JSON.stringify(settingsQuery, null, '').replace(/\./g, '-');

           server.cache.get(cacheKey, function (cachedData) {
               if (!cachedData) {
                   baseMethods.request('GET', settings, function (res, ex) {
                       if (res) {
                           server.cache.add(cacheKey, res, function (cachedRes) {
                               settings.fn(res, ex);
                           });
                       }
                       else {
                           settings.fn(res, ex);
                       }
                   });
               }
               else {
                   settings.fn(cachedData, null);
               }
           });
       }
      , post: function (p, query, body, fn) {
          var settings = parsePostSignature(arguments);
          settings.path = joinPath(resource.path, settings.path);

          // cache invalidation could occur here, but at best its placed on script.js to grap also client post requests

          return baseMethods.post(settings, settings.fn);
      }
      , put: function (p, query, body, fn) {
          var settings = parsePostSignature(arguments);
          settings.path = joinPath(resource.path, settings.path);

          // cache invalidation could occur here, but at best its placed on script.js to grap also client put requests

          return baseMethods.put(settings, settings.fn);
      }
      , del: function (p, query, fn) {
          var settings = parseGetSignature(arguments);
          settings.path = joinPath(resource.path, settings.path);

          // cache invalidation could occur here, but at best its placed on script.js to grap also client del requests

          return baseMethods.del(settings, settings.fn);
      }
      , count: function (p, query, fn) {
          var settings = parseGetSignature(arguments);
          settings.path = joinPath(resource.path, settings.path);

          return baseMethods.count(settings, settings.fn);
      }
    };

    r.exec = function (func, path, body, fn) {
        var settings = {}
          , i = 0;

        settings.func = arguments[i];
        i++;

        // path
        if (typeof arguments[i] === 'string') {
            settings.path = arguments[i];
            i++;
        }

        // body
        if (typeof arguments[i] === 'object') {
            settings.body = arguments[i];
            i++;
        }

        fn = arguments[i];

        settings.path = joinPath(resource, settings.func, settings.path);
        return baseMethods.post(settings, fn);
    };

    resource.clientGenerationGet.forEach(function (func) {
        r[func] = function (path, query, fn) {
            r.get(func, path, query, fn);
        };
    });

    resource.clientGenerationExec.forEach(function (func) {
        r[func] = function (path, query, fn) {
            r.exec(func, path, query, fn);
        };
    });

    return r;
}


function isString(arg) {
    return typeof arg === 'string' || typeof arg === 'number';
}

function toString(arg) {
    return arg ? arg.toString() : null;
}

function parseGetSignature(args) {
    var settings = {}
      , i = 0;

    // path/func
    if (isString(args[i]) || !args[i]) {
        settings.path = toString(args[i]);
        i++;
    }

    // join path to func
    if (isString(args[i]) || !args[i]) {
        settings.path = joinPath(settings.path, toString(args[i]));
        i++;
    }

    // query
    if (typeof args[i] === 'object' || !args[i]) {
        settings.query = args[i];
        i++;
    }

    if (typeof args[i] === 'function') {
        settings.fn = args[i];
    }

    return settings;
}

function parsePostSignature(args) {
    var settings = {}
      , i = 0;

    //path
    if (isString(args[i]) || !args[i]) {
        settings.path = toString(args[i]);
        i++;
    }

    // body
    if (typeof args[i] === 'object' || !args[i]) {
        settings.body = args[i];
        i++;
    }

    // query - if this exists the LAST obj was query and the new one is body
    if (typeof args[i] === 'object') {
        settings.query = settings.body;
        settings.body = args[i];
        i++;
    }

    if (typeof args[i] === 'function') {
        settings.fn = args[i];
    }

    return settings;
}