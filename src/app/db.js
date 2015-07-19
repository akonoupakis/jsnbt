var db = module.exports = {};
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mongodb = require('mongodb');
var uuid = require('./util/uuid');
var scrub = require('scrubber').scrub;
var debug = require('debug')('db');
var cache = require('./cache.js');
var _ = require('underscore');

db.create = function (options) {
  var db = new Db(options);
  return db;
};
 
function Db(options) {
  this.options = options;
  this._mdb = new mongodb.Db(this.options.name, new mongodb.Server(this.options.host, this.options.port));
}
util.inherits(Db, EventEmitter);
db.Db = Db;


Db.prototype.drop = function (fn) {
  getConnection(this, function (err, mdb) {
    mdb.open(function () {
      mdb.dropDatabase(fn);
    });
  });
};


Db.prototype.createStore = function (namespace) {
  return new Store(namespace, this);
};

function Store(namespace, db) {
  this.namespace = namespace;
  this._db = db;
}
module.exports.Store = Store;

function getConnection(db, fn) {
  if(db.connected) {
    fn(null, db._mdb);
  } else if(db.connecting) {
    db.once('connection attempted', function (err) {
      fn(err, db._mdb);
    });
  } else {
    db.connecting = true;
    db._mdb.open(function (err) {
      db.connecting = false;
      db.emit('connection attempted', err);
      if(err) {
        db.connected = false;
        throw err;
      } else {
          
        // check for credentials
        var credentials = db.options.credentials;
        if (credentials && credentials.username && credentials.password) {
          db._mdb.authenticate(credentials.username, credentials.password, function (err) {
            if (err) {
              db.connected = false;
              throw err;
            }
            db.connected = true;
            fn(null, db._mdb);
          });
        } else {
          db.connected = true;
          fn(null, db._mdb);
        }
      }
    });
  }
}

function collection(store, fn) {
  var db = store._db;
  
  getConnection(db, function (err, mdb) {
    if(err) return fn(err);
    
    mdb.collection(store.namespace, function (err, collection) {
      if(err || !collection) {
        console.error(err || new Error('Unable to get ' + store.namespace + ' collection'));
        process.exit(1);
      }
      
      fn(null, collection);
    });
  });
}

Store.prototype.identify = function (object) {
  if(!object) return;
  if(typeof object != 'object') throw new Error('identify requires an object');
  var store = this;
  function set(object) {
    if(object._id) {
      object.id = object._id;
      delete object._id;
    } else {
      var u = object.id || store.createUniqueIdentifier();
      object._id = u;
      delete object.id;
    }
  }
  if(Array.isArray(object)) {
    object.forEach(set);
  } else {
    set(object);
  }
  return object;
};


Store.prototype.scrubQuery = function (query) {
  // private mongo ids can be anywhere in a query object
  // walk the object recursively replacing id with _id
  // NOTE: if you are implementing your own Store,
  // you probably wont need to do this if you want to store ids
  // as 'id'

  if(query.id && typeof query.id === 'object') {
    query._id = query.id;
    delete query.id;
  }

  try {
    scrub(query, function (obj, key, parent, type) {
      // find any value using _id
      if(key === 'id' && parent.id) {
        parent._id = parent.id;
        delete parent.id;
      }
    });  
  } catch(ex) {
    debug(ex);
  }
  
};


Store.prototype.createUniqueIdentifier = function() {
  return uuid.create();
};


Store.prototype.insert = function (object, fn) {
  var store = this;
  this.identify(object);
  collection(this, function (err, col) {
    col.insert(object, function (err, result) {
      if(Array.isArray(result) && !Array.isArray(object)) {
        result = result[0];
      }
      fn(err, store.identify(result));
    });
  });
};


Store.prototype.count = function(query, fn) {
  var store = this;
  if (typeof query == 'function') {
    fn = query;
    query = {};
  } else {
    query && this.scrubQuery(query);
  }

  var fields = stripFields(query)
    , options = stripOptions(query);

  collection(this, function (err, col) {
    if (err) return fn(err);
    col.find(query, fields, options).count(function(err, count) {
      if (err) return fn(err);
      fn(null, count);
    });
  });
};


Store.prototype.find = function (query, fn) {
  var store = this;
  if(typeof query == 'function') {
    fn = query;
    query = {};
  } else {
    query && this.scrubQuery(query);
  }

  // fields
  var fields = stripFields(query)
    , options = stripOptions(query);

  collection(this, function (err, col) {
    if(typeof query._id === 'string') {
      if(fields) {
        col.findOne(query, fields, options, function (err, obj) {
          store.identify(query);
          fn(err, store.identify(obj));
        });
      } else {
        col.findOne(query, options, function (err, obj) {
          store.identify(query);
          fn(err, store.identify(obj));
        });
      }
    } else {
      if(fields) {
        col.find(query,  fields, options).toArray(function (err, arr) {
          fn(err, store.identify(arr));
        });
      } else {
        col.find(query, options).toArray(function (err, arr) {
          fn(err, store.identify(arr));
        });
      }

    }

  });
};


Store.prototype.first = function (query, fn) {
  query && this.scrubQuery(query);

  var store = this
    , fields = stripFields(query);

  collection(this, function (err, col) {
    if(fields) {    
      col.findOne(query, fields, function (err, result) {
        fn(err, store.identify(result));
      });
    } else {    
      col.findOne(query, function (err, result) {
        fn(err, store.identify(result));
      });
    }
  });
};


Store.prototype.update = function (query, object, fn) {
  var store = this
    , multi = false
    , command = {};
    
  if(typeof query == 'string') query = {id: query};
  if(typeof query != 'object') throw new Error('update requires a query object or string id');
  if(query.id) {
    store.identify(query);
  }  else {
    multi = true;
  }

  stripFields(query);

  //Move $ queries outside of the $set command
  Object.keys(object).forEach(function(k) {
    if (k.indexOf('$') === 0) {
      command[k] = object[k];
      delete object[k];
    }
  });
  
  if(Object.keys(object).length) {
    command.$set = object;    
  }
  
  multi = query._id ? false : true;

  debug('update - query', query);
  debug('update - object', object);
  debug('update - command', command);

  collection(this, function (err, col) {
      col.update(query, command, {multi: multi}, function(err) {
      store.identify(query);
      fn(err);
    }, multi);
  });
};


Store.prototype.remove = function (query, fn) {
  var store = this;
  if(typeof query === 'string') query = {id: query};
  if(typeof query == 'function') {
    fn = query;
    query = {};
  }
  if(query.id) {
    store.identify(query);
  }
  collection(this, function (err, col) {
    col.remove(query, fn);
  });
};


Store.prototype.rename = function (namespace, fn) {
  var store = this;
  collection(this, function (err, col) {
    store.namespace = namespace;
    col.rename(namespace, fn);
  });
};

function stripFields(query) {
  if(!query) return;
  var fields = query.$fields;
  if(fields) delete query.$fields;
  return fields;
}

function stripOptions(query) {
  var options = {};
  if(!query) return options;
  // performance
  if(query.$limit) options.limit = query.$limit;
  if(query.$skip) options.skip = query.$skip;
  if(query.$sort || query.$orderby) options.sort = query.$sort || query.$orderby;
  delete query.$limit;
  delete query.$skip;
  delete query.$sort;
  return options;
}



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


db.build = function (server, session, stack) {
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

                var resourceRouter = require('./routing/resource.js')(server);
                var resourceContext = require('./context.js')(server, req, res);
                resourceRouter.process(resourceContext);
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
