var fs = require('fs');
var crypto = require('crypto');

function Keys(path) {
  this.path = path || '.dpd/keys.json';
}
module.exports = Keys;

Keys.prototype.get = function(key, fn) {
  this.readFile(function(err, data) {
    fn(err, data[key]);
  });
};

Keys.prototype.generate = function() {
  return crypto.randomBytes(256).toString('hex');
};

Keys.prototype.create = function(fn) {
  var key = this.generate()
    , keys = this;

  this.readFile(function(err, data) {
    if(err) return fn(err);

    data[key] = true;
    keys.writeFile(data, function(err) {
      fn(err, key);
    });
  });
};

Keys.prototype.readFile = function(fn) {
  fs.readFile(this.path, 'utf-8', function(err, data) {
    var jsonData
      , error;

    try {
      jsonData = (data && JSON.parse(data)) || {};
    } catch (ex) {
      error = ex;
    }

    fn(error, jsonData);
  });
};

Keys.prototype.writeFile = function(data, fn) {
  var str;

  try {
    str = JSON.stringify(data);
  } catch(e) {
    return fn(e);
  }

  fs.writeFile(this.path, str, fn);
};

Keys.prototype.getLocal = function(fn) {
  this.readFile(function(err, data) {
    if(err) return fn(err);
    if(data && typeof data == 'object') {
      fn(null, Object.keys(data)[0]);
    } else {
      fn();
    }
  });
};