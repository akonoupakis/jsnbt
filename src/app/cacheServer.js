module.exports = function () {

    return {
        add: function (key, value, cb) {

            if (typeof (cb) === 'function')
                cb(value);

        },

        get: function (key, cb) {

            if (typeof (cb) === 'function')
                cb(obj);

        },

        purge: function (key, cb) {

            if (typeof (cb) === 'function')
                cb();
        },

        getKeys: function (key, cb) {

            if (typeof (cb) === 'function')
                cb([]);
        }
    };

};