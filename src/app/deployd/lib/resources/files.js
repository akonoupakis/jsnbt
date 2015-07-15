var validation = require('validation');
var util = require('util');
var send = require('send');
var Resource = require('../resource');
var path = require('path');
var debug = require('debug')('files');
var fs = require('fs');
var url = require('url');
var respond = require('doh').createResponder();

function Files(name, options) {
  Resource.apply(this, arguments);
  if(this.config['public']) {
    this['public'] = this.config['public'];
  } else {
    throw new Error('public root folder location required when creating a file resource');
  }
}
util.inherits(Files, Resource);

Files.prototype.handle = function (ctx, next) {
  if(ctx.req && ctx.req.method !== 'GET') return next();

  send(ctx.req, url.parse(ctx.url).pathname)
    .root(path.resolve(this['public']))
    .on('error', function (err) {
      ctx.res.statusCode = 404;
      respond('Resource Not Found', ctx.req, ctx.res);
    })
    .pipe(ctx.res);
};

module.exports = Files;