var _ = require('underscore');

module.exports = function (sender, context, data) {
    
    context.store.get(function (x) {
        x.query({});
    }, function (error, results) {
        if (error)
            return context.error(error);
        
        if (results.length === 0) {
            data.default = true;
        }
        else {
            var existing = _.find(results, function (x) { return x.code === data.code; });
            if (existing) {
                return context.error(400, 'language code already exists');
            }
        }

        context.done();
    });

};