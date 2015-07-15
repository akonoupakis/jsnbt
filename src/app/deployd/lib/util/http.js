var Cookies = require('cookies');
var qs = require('qs');
var parseUrl = require('url').parse;
var corser = require('corser');
var ALLOWED_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];


exports.setup = function(req, res, next) {
  var remoteHost = req.headers.origin
    , corsOpts = {supportsCredentials: true, methods: ALLOWED_METHODS};
    
  if(remoteHost) {
    corsOpts.origins = [remoteHost];
  } else {
    corsOpts.supportsCredentials = false;
  }
  
  corsOpts.requestHeaders = corser.simpleRequestHeaders.concat(["X-Requested-With"]);
  var handler = corser.create(corsOpts);
  
  handler(req, res, function () {
    req.cookies = res.cookies = new Cookies(req, res);

    if(~req.url.indexOf('?')) {
      try {
        req.query = parseQuery(req.url);  
        var m = req.query._method;
        if ( m ) {
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
    
    switch(req.method) {
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

        if(autoParse[mime]) {
          autoParse[mime](req, res, mime, next);
        } else {
          if(req.headers['content-length']) req.pause();
          next();
        }
      break;
      default:
        next();
      break;
    }
  });
};

var parseBody = exports.parseBody = function(req, res, mime, callback) {
  var buf = '';

  req.on('data', function(chunk){ buf += chunk; });
  req.on('end', function(){
    var parser = JSON;

    if (mime === 'application/x-www-form-urlencoded') {
      parser = qs;
    }

    try {
      if(buf.length) {
        if(mime === 'application/json' && '{' != buf[0] && '[' != buf[0]) {
          res.setHeader('Content-Type', 'text/plain');
          res.statusCode = 400;
          res.end('Could not parse invalid JSON');
          return;
        }
        
        req.body = parser.parse(buf);
        var m = req.body['_method'];
        if ( m ) {
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

var parseQuery = exports.parseQuery = function(url) {
  var q = url.substr(url.indexOf('?') + 1);

  if(q) q = decodeURIComponent(q);
   
  if(q[0] === '{' && q[q.length - 1] === '}') {
    return JSON.parse(q);
  } else {
    return parseNumbersInObject(qs.parse(parseUrl(url).query)); 
  }
};

exports.redirect = function(res, url, statusCode) {
  res.statusCode = statusCode || 301;
  res.setHeader("Location", url);
  res.end();
};

var autoParse = {
  'application/x-www-form-urlencoded': parseBody,
  'application/json': parseBody
};

var isInt = /^[0-9]+$/;
var isFloat = /^[-+]?[0-9]*\.?[0-9]+$/;
var parseNumbersInObject = function( obj ){
  var ret = {}, key;
  for(key in obj){
    val = obj[key];
    if(isInt.test(val)){
      ret[key] = parseInt(val);
    } else if(isFloat.test(val)){
      ret[key] = parseFloat(val);
    } else if (typeof val === 'object'){
      ret[key] = parseNumbersInObject(val);
    } else {
      ret[key] = val;
    }
  }
  return ret;
}
