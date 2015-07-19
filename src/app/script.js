var vm = require('vm');
var _ = require('underscore')._;
var EventEmitter = require('events').EventEmitter;
var sessionFile = require('./session');
var path = require('path');
var fs = require('fs');

function Script(src, path) {
    try {
        this.compiled = vm.createScript('(function() {' + src + '\n}).call(_this)', path);
    } catch (ex) {
        this.error = ex;
    }
}

Script.prototype.run = function (ctx, domain, fn) {
    
    if (this.error) { fn(this.error); }

    if (typeof domain === 'function') {
        fn = domain;
        domain = undefined;
    }

    var req = ctx.req
      , session = ctx.session
      , callbackCount = 0
      , events;

    var self = this;

    var scriptContext = {
        'this': {},
        cancel: function (msg, status) {
            var err = { message: msg, statusCode: status };
            throw err;
        },
        cancelIf: function (condition, msg, status) {
            if (condition) {
                scriptContext.cancel(msg, status);
            }
        },
        cancelUnless: function (condition, msg, status) {
            scriptContext.cancelIf(!condition, msg, status);
        },
        me: session && session.user,
        isMe: function (id) {
            return (scriptContext.me && scriptContext.me.id === id) || false;
        },
        console: console,
        query: ctx.query,
        internal: req && req.internal,
        isRoot: req && req.session && req.session.isRoot,
        require: require,
        requireApp: function (requiredPath) {
            return require(path.join(sessionFile.appPath, requiredPath));
        },
        emit: function (collection, query, event, data) {
            if (arguments.length === 4) {
                session.emitToUsers(collection, query, event, data);
            } else if (arguments.length <= 2) {
                event = collection;
                data = query;
                if (session.emitToAll) session.emitToAll(event, data);
            }
        },
        server: ctx.server
    };

    scriptContext._this = scriptContext['this'];
    scriptContext._error = undefined;

    events = new EventEmitter();

    function done(err) {
        events.removeAllListeners('finishCallback');
        if (fn) fn(err);
    }

    if (domain) {

        events.on('addCallback', function () {
            callbackCount++;
        });

        events.on('finishCallback', function () {
            callbackCount--;
            if (callbackCount <= 0) {
                done(scriptContext._error);
            }
        });

        events.on('error', function (err) {
            done(err);
        });

        domain.db = ctx.db;

        if (fn) {
            // if a callback is expected, count callbacks
            // and manually merge the domain
            wrapAsyncFunctions(domain, scriptContext, events, done);
        } else {
            // otherwise just merge the domain
            Object.keys(domain).forEach(function (key) {
                scriptContext[key] = domain[key];
            });
        }
        scriptContext['this'] = scriptContext._this = domain.data;
    }

    var err;

    try {
        self.compiled.runInNewContext(scriptContext);
    } catch (e) {
        err = wrapError(e);
        scriptContext._error = err;
    }
    err = err || scriptContext._error;
    process.nextTick(function () {
        if (callbackCount <= 0) {
            done(err);
        }
    });
};

var cachedPaths = {};

Script.load = function (path, fn) {
    if (cachedPaths[path]) {
        fn(null, new Script(cachedPaths[path], path));
    }
    else {
        fs.readFile(path, 'utf-8', function (err, val) {
            if (val) {
                cachedPaths[path] = val;
                fn(err, new Script(val, path));
            } else {
                cachedPaths[path] = '';
                fn(err, new Script('', path));
            }
        });
    }
};

function wrapError(err) {
    if (err && err.__proto__ && global[err.__proto__.name]) {
        err.__proto__ = global[err.__proto__.name].prototype;
    }
    return err;
}

function wrapAsyncFunctions(asyncFunctions, sandbox, events, done, sandboxRoot) {
    if (!sandboxRoot) sandboxRoot = sandbox;

    if (!asyncFunctions) {
        // stop if asyncFunctions does not exist
        return;
    }

    Object.keys(asyncFunctions).forEach(function (k) {
        if (typeof asyncFunctions[k] === 'function') {
            sandbox[k] = function () {
                if (sandboxRoot._error) return;

                var args = _.toArray(arguments);
                var callback;
                var callbackIndex;
                var result;

                for (var i = 0; i < args.length; i++) {
                    if (typeof args[i] == 'function') {
                        callback = args[i];
                        callbackIndex = i;
                        break;
                    }
                }

                if (typeof callback === 'function') {
                    events.emit('addCallback');
                    args[callbackIndex] = function () {
                        if (sandboxRoot._error) return;
                        try {
                            result = callback.apply(sandboxRoot._this, arguments);
                            events.emit('finishCallback');
                        } catch (err) {
                            var wrappedErr = wrapError(err);
                            sandbox._error = wrappedErr;
                            return done(wrappedErr);
                        }
                    };
                } else {
                    args.push(function () {
                        if (sandboxRoot._error) return;
                        events.emit('finishCallback');
                    });
                }
                try {
                    result = asyncFunctions[k].apply(sandboxRoot._this, args);
                } catch (err) {
                    var wrappedErr = wrapError(err);
                    sandbox._error = wrappedErr;
                    return done(wrappedErr);
                }

                if (result !== undefined) {
                    return result;
                }
            };
        } else if (typeof asyncFunctions[k] === 'object' && !(asyncFunctions[k] instanceof Array)) {
            sandbox[k] = sandbox[k] || {};
            wrapAsyncFunctions(asyncFunctions[k], sandbox[k], events, done, sandboxRoot);
        } else {
            sandbox[k] = asyncFunctions[k];
        }
    });
}

module.exports = Script;