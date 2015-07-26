var _ = require('underscore');

var self = this;

db.languages.get({ }, function (error, results) {
    if (error)
        throw error;
    else {
        if (results.length === 0) {
            self.default = true;
        }
        else {
            var existing = _.find(results, function (x) { return x.code === self.code; });
            if (existing) {
                cancel('language code already exists', 400);
            }
        }
    }
});