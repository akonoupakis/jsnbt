var app = require('./app.js');

var _ = require('underscore');

module.exports = {
    
    url: {

    },

    active: {
    
    },

    purge: function (nodeId) {
        var self = this;

        var filteredUrlKeys = _.filter(_.keys(self.url), function (x) { return x.indexOf(nodeId) !== -1; });
        _.each(filteredUrlKeys, function (key) {
            delete self.url[key];
        });

        var filteredActiveKeys = _.filter(_.keys(self.active), function (x) { return x.indexOf(nodeId) !== -1; });
        _.each(filteredActiveKeys, function (key) {
            delete self.active[key];
        });

    }

};