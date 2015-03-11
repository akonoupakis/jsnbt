var jsnbt = requireApp('jsnbt.js');

var _ = require('underscore');

var self = this;

var knownDomains = _.pluck(_.uniq(jsnbt.lists, function (x) { return x.domain; }), 'domain');
if (_.filter(knownDomains, function (x) { return x === self.domain; }).length === 0) {
    error('domain', 'not a known domain');
}

var knownLists = _.pluck(_.uniq(jsnbt.lists, function (x) { return x.id; }), 'domain');
if (_.filter(knownLists, function (x) { return x === self.domain; }).length === 0) {
    error('list', 'not a known list');
}

var knownLanguageCodes = _.pluck(jsnbt.languages, 'code');

var knownList = _.first(_.filter(jsnbt.lists, function (x) { return x.id === self.list; }));

if (jsnbt.localization) {
    if (self.content.localized) {
        for (var lang in self.content.localized) {
            if (knownLanguageCodes.indexOf(lang) === -1)
                error('content.localized[' + lang + ']', lang + ' not a known language');
        }
    }
}