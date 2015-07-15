var db = module.exports = {};
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var mongodb = require('mongodb');
var uuid = require('./util/uuid');
var scrub = require('scrubber').scrub;
var debug = require('debug')('db');


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
