var db = require('./database');
var Store = require('./database').Store;
var util = require('util');
var Cookies = require('cookies');
var EventEmitter = require('events').EventEmitter;

var sessionIndex = {}
  , userSessionIndex = {};

function SessionStore(namespace, db, sockets) {
  this.sockets = sockets;

  // socket queue
  var socketQueue = this.socketQueue = new EventEmitter()
    , socketIndex = this.socketIndex = {};

  if(sockets) {
    sockets.on('connection', function (socket) {
      // NOTE: do not use set here ever, the `Cookies` api is meant to get a req, res
      // but we are just using it for a cookie parser
      var cookies = new Cookies(socket.handshake)
        , sid = cookies.get('sid');

      if(sid) {
        // index sockets against their session id
        socketIndex[sid] = socket;
        socketQueue.emit(sid, socket);
      }
    });
  } 

  Store.apply(this, arguments);
}
util.inherits(SessionStore, Store);
exports.SessionStore = SessionStore;

SessionStore.prototype.createUniqueIdentifier = function() {
  return db.uuid.create(128);
};

SessionStore.prototype.createSession = function(sid, fn) {
  var socketIndex = this.socketIndex
    , store = this;

  if(typeof sid == 'function') {
    fn = sid;
    sid = undefined;
  }
  if(sid) {
    this.find({id: sid}, function(err, s) {
      if(err) return fn(err);
      if(!s) {
        store.insert({id: sid}, function(err, s) {
          if(err) console.error(err);
        });
      }
      var sess = sessionIndex[sid] || new Session(s, store, socketIndex, store.sockets);
      sessionIndex[sid] = sess;
      // index sessions by user
      if(s && s.uid) {
        userSessionIndex[s.uid] = sess;
      }
      fn(err, sess);
    });
  } else {
    sid = this.createUniqueIdentifier();
    var sess = sessionIndex[sid] = new Session({id: sid}, this, socketIndex, store.sockets);
    fn(null, sess);
    this.insert({id: sid}, function(err, s) {
      if(err) console.error(err);
    });
  }
};

function Session(data, store, sockets, rawSockets) {
  var sid;
  this.data = data;
  if(data && data.id) this.sid = sid = data.id;
  this.store = store;

  // create faux socket, to queue any events until
  // a real socket is available
  var socketWrapper = this.socket = {
    on: function () {
      var s = sockets[sid];
      // if we have a real socket, use it
      if(s) {
        s.on.apply(s, arguments);
      } else {
        // otherwise add to bind queue
        var queue = this._bindQueue = this._bindQueue || [];
        queue.push(arguments);
      }
    },
    emit: function (ev) {
      var s = sockets[sid];
      
      // if we have a real socket, use it
      if(s) {
        s.emit.apply(s, arguments);
      } else {
        // otherwise add to bind queue
        var queue = this._emitQueue = this._bindQueue || [];
        queue.push(arguments);
      }
    }
  };

  this.emitToUsers = function(collection, query, event, data) {
    collection.get(query, function(users) {
      var userSession;
      if(users && users.id) {
        userSession = userSessionIndex[users.id];
        if(userSession && userSession.socket) {
          userSession.socket.emit(event, data);
        }
        return;
      }
      users.forEach(function(u) {
        userSession = userSessionIndex[u.id];

        // emit to sessions online
        if(userSession && userSession.socket) {
          userSession.socket.emit(event, data);
        }
      });
    });
  };

  this.emitToAll = function() {
    rawSockets.emit.apply(rawSockets, arguments);
  };

  // resolve queue once a socket is ready
  store.socketQueue.once(this.sid, function (socket) {
    // drain bind queue
    if(socketWrapper._bindQueue && socketWrapper._bindQueue.length) {
      socketWrapper._bindQueue.forEach(function (args) {
        socket.on.apply(socket, args);
      });
    }
    // drain emit queue
    if(socketWrapper._emitQueue && socketWrapper._emitQueue.length) {
      socketWrapper._emitQueue.forEach(function (args) {
        socket.emit.apply(socket, args);
      });
    }
  });
}

Session.prototype.set = function(object) {
  var session = this
    , data = session.data || (session.data = {});

  Object.keys(object).forEach(function(key) {
    data[key] = object[key];
  });
  return this;
};

Session.prototype.save = function(fn) {
  var session = this
    , data = this.data
    , query = {id: data.id};

  session.remove(function (err) {
    if(err) return fn(err);
    session.store.insert(data, function (err, res) {
      fn(err, res);
    });
  });
  return this;
};

Session.prototype.fetch = function(fn) {
  var session = this;
  this.store.first({id: this.data.id}, function (err, data) {
    session.set(data);
    fn(err, data);
  });
  return this;
};

Session.prototype.remove = function(fn) {
  var session = this;

  delete sessionIndex[this.data.id];
  delete userSessionIndex[this.data.uid]; // TODO: Don't delete all of a user's sessions
  delete session.store.socketIndex[this.data.id];

  this.store.remove({id: this.data.id}, fn);

  return this;
};