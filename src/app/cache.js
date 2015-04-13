var _ = require('underscore');

module.exports = function() {

    var cache = {};
        
    var getCacheObject = function (str) {
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

    var createCacheObject = function (str) {
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

    return {
        add: function (key, value, cb) {
            
            var parentKey = key.split('.').reverse().slice(1).reverse().join('.');
            var currentKey = key.split('.').pop();

            var obj = getCacheObject(parentKey);

            if (!obj)
                obj = createCacheObject(parentKey);

            obj[currentKey] = value;

            if (typeof (cb) === 'function')
                cb(value);

        },

        get: function (key, cb) {

            var obj = getCacheObject(key);
            
            if (typeof (cb) === 'function')
                cb(obj);

        },

        purge: function (key, cb) {

            var parentKey = key.split('.').reverse().slice(1).reverse().join('.');
            var currentKey = key.split('.').pop();

            var obj = getCacheObject(parentKey);

            if (obj)
                delete obj[currentKey];

            if (typeof (cb) === 'function')
                cb();
        },

        getKeys: function (key, cb) { 
            
            var obj = getCacheObject(key);

            var keys = _.keys(obj);

            if (typeof (cb) === 'function')
                cb(keys);
        }
    };
};