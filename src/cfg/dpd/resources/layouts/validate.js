var _ = require('underscore');

var self = this;

var layout = _.find(server.jsnbt.layouts, function (x) {
    return x.id === self.layout;
});
if (!layout)
    error('layout', 'not a known layout');