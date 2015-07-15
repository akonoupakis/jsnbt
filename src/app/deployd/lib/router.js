var Context = require('./context');
var escapeRegExp = /[\-\[\]{}()+?.,\\\^$|#\s]/g;
var debug = require('debug')('router');
var doh = require('doh');
var error404 = doh.createResponder();
var async = require('async');

function Router(resources, server) {
  this.resources = resources || [];
  this.server = server;
}
 
Router.prototype.route = function (req, res) {
  var router = this
    , server = this.server
    , url = req.url
    , resources = this.matchResources(url)
    , i = 0;

  if (req._routed) {
    return;
  }

  req._routed = true;

  async.series([function(fn) {
    async.forEach(router.resources, function(resource, fn) {
      if(resource.handleSession) {
        var ctx = new Context(resource, req, res, server);
        resource.handleSession(ctx, fn); 
      } else {
        fn();
      }
    }, fn);
  }], function(err) {
    if (err) throw err;
    nextResource();
  });

  //TODO: Handle edge case where ctx.next() is called more than once
  function nextResource() {
    var resource = resources[i++]
      , ctx;
    
    var handler = doh.createHandler({req: req, res: res, server: server});    
    handler.run(function () {
      process.nextTick(function () {
        if (resource) {
          debug('routing %s to %s', req.url, resource.path);
          ctx = new Context(resource, req, res, server);
          ctx.router = router;

          // default root to false
          if(ctx.session) ctx.session.isRoot = req.isRoot || false;
    
          // external functions
          var furl = ctx.url.replace('/', '');
          if(resource.external && resource.external[furl]) {
            resource.external[furl](ctx.body, ctx, ctx.done);
          } else {
            resource.handle(ctx, nextResource);
          }
        } else {
          debug('404 %s', req.url);
          res.statusCode = 404;
          error404({message: 'resource not found'}, req, res);
        }
      });
    });
  }
 
};

Router.prototype.matchResources = function(url) {
  var router = this
    , result;

  debug('resources %j', this.resources.map(function(r) { return r.path; }));

  if (!this.resources || !this.resources.length) return [];

  result = this.resources.filter(function(d) {
    return url.match(router.generateRegex(d.path));
  }).sort(function(a, b) {
    return specificness(b) - specificness(a);
  });
  return result;
};

Router.prototype.generateRegex = function(path) {
  if (!path || path === '/') path = '';
  path = path.replace(escapeRegExp, '\\$&');
  return new RegExp('^' + path + '(?:[/?].*)?$');
};

function specificness(resource) {
  var path = resource.path;
  if (!path || path === '/') path = '';
  return path.split('/').length;
}

module.exports = Router;