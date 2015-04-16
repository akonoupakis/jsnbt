var _ = require('underscore');

var self = this;

var knownLanguages = server.jsnbt.languages;
if (_.filter(knownLanguages, function (x) { return x.code === self.code; }).length === 0) {
    error('code', 'not a known language code');
}