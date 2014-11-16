var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

if(!jsnbt.layouts[self.layout])
    error('layout', 'not a known layout');