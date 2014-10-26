var app = require('./app.js');

var _ = require('underscore');

module.exports = {
    
    url: {

    },

    purge: function (nodeId) {
        var self = this;

        var filteredKeys = _.filter(_.keys(self.url), function (x) { return x.indexOf(nodeId) !== -1; });
        _.each(filteredKeys, function (key) {
            delete self.url[key];
        });

    }

};