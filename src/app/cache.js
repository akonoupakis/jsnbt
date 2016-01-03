var _ = require('underscore');

var getCacheObject = function (cache, str) {
    var result = undefined;

    var strParts = str.split('.');

    result = cache;

    if (str !== '') {

        var undef = false;
        _.each(strParts, function (part, i) {

            if (!undef) {
                if (result[part] !== undefined) {
                    result = result[part];
                }
                else {
                    result = undefined;
                    undef = true;
                }
            }

        });
    }

    return result;
};

var createCacheObject = function (cache, str) {
    var result = undefined;

    var strParts = str.split('.');

    result = cache;
    var undef = false;

    _.each(strParts, function (part, i) {

        if (result[part] === undefined)
            result[part] = {};

        result = result[part];

    });

    return result;
};

var Cache = function (server) {
    this.server = server;
    this.cache = {};
};

Cache.prototype.add = function (key, value, cb) {
            
    var parentKey = key.split('.').reverse().slice(1).reverse().join('.');
    var currentKey = key.split('.').pop();

    var obj = getCacheObject(this.cache, parentKey);

    if (!obj)
        obj = createCacheObject(this.cache, parentKey);

    obj[currentKey] = value;

    cb(null, value);

};

Cache.prototype.get = function (key, cb) {

    var obj = getCacheObject(this.cache, key);
            
    cb(null, obj);

};

Cache.prototype.purge = function (key, cb) {

    var parentKey = key.split('.').reverse().slice(1).reverse().join('.');
    var currentKey = key.split('.').pop();

    var obj = getCacheObject(this.cache, parentKey);

    if (obj)
        delete obj[currentKey];

    cb();
};

Cache.prototype.getKeys = function (key, cb) {

    var obj = getCacheObject(this.cache, key);
    var keys = _.keys(obj);

    cb(null, keys);

};

module.exports = function (server) {
    return new Cache(server);
}