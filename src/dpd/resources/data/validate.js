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

var knownLanguageCodes = _.pluck(jsnbt.getLanguages(), 'code');

var knownList = _.first(_.filter(jsnbt.lists, function (x) { return x.id === self.list; }));

if (self.localization.enabled === true) {
    if (knownList.localized !== true) {
        error('localization.enabled', 'list cannot be localized');
    }
    else {
        for (var lang in self.data.localized) {
            if (knownLanguageCodes.indexOf(lang) === -1)
                error('data.localized[' + lang + ']', lang + ' not a known language');
        }
    }
}
else {
    if (knownList.localized !== false) {
        error('localization.enabled', 'list should be localized');
    }
    else {
        if (knownLanguageCodes.indexOf(self.localization.language) === -1)
            error('localization.language', self.localization.language + ' not a known language');
    }
}