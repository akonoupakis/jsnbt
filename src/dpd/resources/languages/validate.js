var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var knownLanguages = jsnbt.getLanguages();
if (_.filter(knownLanguages, function (x) { return x.code === self.code; }).length === 0)
{
    error('code', 'not a known language code');
}