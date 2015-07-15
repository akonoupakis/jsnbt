var internalClient = require('./internal-client');
var debug = require('debug')('context');
var respond = require('doh').createResponder();


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
  
  // always bind done to this
  var done = this.done;
  this.done = function() {
    done.apply(ctx, arguments);
  };

  if ((this.query && typeof this.query.$limitRecursion !== 'undefined') || (this.body && typeof this.body.$limitRecursion !== 'undefined')) {
    var recursionLimit = this.query.$limitRecursion || this.body.$limitRecursion || 0;
    req.stack = req.stack || [];
    req.stack.recursionLimit = recursionLimit;
  }

  this.dpd = req.dpd || internalClient.build(server, req.session, req.stack);
}

Context.prototype.end = function() {
  return this.res.end.apply(this.res, arguments);
};

Context.prototype.done = function(err, res) {
  var body = res
    , type = 'application/json';
  
  // default response
  var status = this.res.statusCode = this.res.statusCode || 200; 

  if(err) {
    debug('%j', err);
    if(status < 400) this.res.statusCode = 400;
    if(err.statusCode) this.res.statusCode = err.statusCode;
    respond(err, this.req, this.res);
  } else {
    if(typeof body == 'object') {
      body = JSON.stringify(body);
    } else {
      type = 'text/html; charset=utf-8';
    }

    try {
      if(status != 204 && status != 304) {
        if(body) {
          this.res.setHeader('Content-Length', Buffer.isBuffer(body)
               ? body.length
               : Buffer.byteLength(body));
        }
        this.res.setHeader('Content-Type', type);
        this.res.end(body);
      } else {
        this.res.end();
      }
    } catch(e) {
      console.error(e);
    }
  }
};

module.exports = Context;