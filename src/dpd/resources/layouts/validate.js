var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var layout = _.find(jsnbt.layouts, function (x) {
    return x.id === self.layout;
});
if (!layout)
    error('layout', 'not a known layout');