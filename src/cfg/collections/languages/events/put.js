var async = require('async');

module.exports = function (sender, context, data) {
    var self = this;

    var asyncs = [];

    asyncs.push(function (cb) { 
        if (context.changed('code')) {
            context.store.get(function (x) {
                x.query({
                    code: self.code,
                    id: {
                        $nin: [data.id]
                    }
                });
                x.single();
            }, function (matchedError, matched) {
                if (matchedError)
                    return cb(matchedError);
            
                if (matched)
                    return cb('language code already exists');

                cb();
            });
        }
        else {
            cb();
        }
    });

    asyncs.push(function (cb) {
        if (context.changed('active')) {
            if (!data.active && data.default)
                return cb('language is default and cannot be deactivated');
        }

        cb();
    });


    asyncs.push(function (cb) {
        if (context.changed('default')) {
            if (!data.default) {

                context.store.get(function (x) {
                    x.query({
                        active: true,
                        'default': true,
                        id: { $nin: [data.id] }
                    });
                }, function (defaultsError, defaults) {
                    if (defaultsError)
                        return cb(defaultsError);

                    if (defaults.length === 0)
                        return cb('cannot set to false as there are no other active default languages');

                    cb();
                });

            }
            else {
                cb();
            }
        }
        else {
            cb();
        }
    });

    async.parallel(asyncs, function (err, results) {
        if (err)
            return context.error(err);

        context.done();
    });

};